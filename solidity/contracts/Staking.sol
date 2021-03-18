/* Copyright (C) 2020 PlotX.io
  This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
  This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
  You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/ */

pragma solidity 0.5.7;

import "./external/openzeppelin-solidity/math/SafeMath.sol";
import "./external/openzeppelin-solidity/token/ERC20/ERC20.sol";


contract Staking{
    
    using SafeMath for uint256;

    /**
     * @dev Structure to store Interest details.
     * It contains total amount of tokens staked and globalYield.
     */
    struct InterestData {
        uint256 globalTotalStaked;
        uint256 globalYieldPerToken; 
        uint256 lastUpdated;
        mapping(address => Staker) stakers;  
    }

    /**
     * @dev Structure to store staking details.
     * It contains amount of tokens staked and withdrawn interest.
     */
    struct Staker {
        uint256 totalStaked;
        uint256 withdrawnToDate;
        uint256 stakeBuyinRate;  
    }

    /**
     * @dev Structure to store Rewards details.
     * Contains the address of the rewards tokens and amount of rewards distribution
     */
    struct RewardsTokens {
        ERC20 token;
        uint256 totalReward; 
    }

    // A dynamically-sized array of `rewardsTokens` structs.
    RewardsTokens[] public rewardsTokens;

    // Token address
    ERC20 private stakeToken;

    // Interest and staker data
    InterestData public interestData;

    uint public stakingStartTime;


    // unclaimed reward will be trasfered to this account
    address public vaultAddress; 

    // 10^18
    uint256 private constant DECIMAL1e18 = 10**18;

    //Total time (in sec) over which reward will be distributed
    uint256 public stakingPeriod;


    /**
     * @dev Emitted when `staker` stake `value` tokens.
     */
    event Staked(address indexed staker, uint256 value, uint256 _globalYieldPerToken);

    /**
     * @dev Emitted when `staker` withdraws their stake `value` tokens.
     */
    event StakeWithdrawn(address indexed staker, uint256 value, uint256 _globalYieldPerToken);


    /**
     * @dev Emitted when `staker` collects interest `_value`.
     */
    event InterestCollected(
        address indexed staker,
        uint256 _value,
        uint256 _globalYieldPerToken
    );

    /**     
     * @dev Constructor     
     * @param _stakeToken The address of stake Token       
     * @param _rewardTokens The address of reward Tokens   
     * @param _stakingPeriod valid staking time after staking starts
     * @param _totalRewardToBeDistributed total amount to be distributed as rewards
     */
    constructor(
        address _stakeToken,
        address[] memory _rewardTokens,
        uint256 _stakingPeriod,
        uint256[] memory _totalRewardToBeDistributed,
        uint256 _stakingStart,
        address _vaultAdd
    ) public {
        require(_stakingPeriod > 0, "Should be positive");
        require(_rewardTokens.length > 0, "Total reward items cannot be empty");
        require(_totalRewardToBeDistributed.length == _rewardTokens.length, "Total reward items shall be coherent with the amounts items");
        require(_stakingStart >= now, "Can not be past time");
        require(_stakeToken != address(0), "Can not be null address");
        require(_vaultAdd != address(0), "Can not be null address");
        stakeToken = ERC20(_stakeToken);
        
        for (uint i = 0; i < _rewardTokens.length; i++) {
            require(_rewardTokens[i] != address(0), "Can not be null address");
            require(_totalRewardToBeDistributed[i] > 0, "Should be positive");
            rewardsTokens.push(RewardsTokens({
                token: ERC20(_rewardTokens[i]),
                totalReward: _totalRewardToBeDistributed[i]
            }));
        }

        stakingStartTime = _stakingStart;
        interestData.lastUpdated = _stakingStart;
        stakingPeriod = _stakingPeriod;
        vaultAddress = _vaultAdd;
    }

    /**
     * @dev Allows a staker to deposit Tokens. Notice that `approve` is
     * needed to be executed before the execution of this method.
     * @param _amount The amount of tokens to stake
     */
    function stake(uint256 _amount) external {
        require(_amount > 0, "You need to stake a positive token amount");
        require(
            stakeToken.transferFrom(msg.sender, address(this), _amount),
            "TransferFrom failed, make sure you approved token transfer"
        );
        require(now.sub(stakingStartTime) <= stakingPeriod, "Can not stake after staking period passed");

        for (uint r = 0; r < rewardsTokens.length; r++) {
            uint newlyInterestGenerated = now.sub(interestData.lastUpdated).mul(rewardsTokens[r].totalReward).div(stakingPeriod);
            interestData.lastUpdated = now;
            updateGlobalYieldPerToken(r, newlyInterestGenerated);
            updateStakeData(msg.sender, _amount);
            emit Staked(msg.sender, _amount, interestData.globalYieldPerToken);
        }
        
        
    }

    /**
     * @dev Updates InterestData and Staker data while staking.
     * must call update globalYieldPerToken before this operation
     * @param _staker                 Staker's address
     * @param _stake                  Amount of stake
     *
     */
    function updateStakeData(
        address _staker,
        uint256 _stake
    ) internal {
        Staker storage _stakerData = interestData.stakers[_staker];

        _stakerData.totalStaked = _stakerData.totalStaked.add(_stake);

        updateStakeBuyinRate(
            _stakerData,
            interestData.globalYieldPerToken,
            _stake
        );

        interestData.globalTotalStaked = interestData.globalTotalStaked.add(_stake);
    }

    /**
     * @dev Calculates and updates the yield rate in which the staker has entered
     * a staker may stake multiple times, so we calculate his cumulative rate his earning will be calculated based on GlobalYield and StakeBuyinRate
     * Formula:
     * StakeBuyinRate = [StakeBuyinRate(P) + (GlobalYield(P) x Stake)]
     *
     * @param _stakerData                  Staker's Data
     * @param _globalYieldPerToken         Total yielding amount per token 
     * @param _stake                       Amount staked 
     *
     */
    function updateStakeBuyinRate(
        Staker storage _stakerData,
        uint256 _globalYieldPerToken,
        uint256 _stake
    ) internal {

        _stakerData.stakeBuyinRate = _stakerData.stakeBuyinRate.add(
            _globalYieldPerToken.mul(_stake).div(DECIMAL1e18)
        );
    }

    /**
     * @dev Withdraws the sender staked Token.
     */
    function withdrawStakeAndInterest(uint256 _amount) external {
        Staker storage staker = interestData.stakers[msg.sender];
        require(_amount > 0, "Should withdraw positive amount");
        require(staker.totalStaked >= _amount, "Not enough token staked");
        withdrawInterest();
        updateStakeAndInterestData(msg.sender, _amount);
        require(stakeToken.transfer(msg.sender, _amount), "withdraw transfer failed");
        emit StakeWithdrawn(msg.sender, _amount, interestData.globalYieldPerToken);
    }
    
    /**
     * @dev Updates InterestData and Staker data while withdrawing stake.
     *
     * @param _staker                 Staker address
     * @param _amount                 Amount of stake to withdraw
     *
     */    
    function updateStakeAndInterestData(
        address _staker,
        uint256 _amount
    ) internal {
        Staker storage _stakerData = interestData.stakers[_staker];

        _stakerData.totalStaked = _stakerData.totalStaked.sub(_amount);

        interestData.globalTotalStaked = interestData.globalTotalStaked.sub(_amount);

        _stakerData.stakeBuyinRate = 0;
        _stakerData.withdrawnToDate = 0;
        updateStakeBuyinRate(
            _stakerData,
            interestData.globalYieldPerToken,
            _stakerData.totalStaked
        );
    }

    /**
     * @dev Withdraws the sender Earned interest.
     */
    function withdrawInterest() public {
        uint timeSinceLastUpdate = _timeSinceLastUpdate();

        Staker storage stakerData = interestData.stakers[msg.sender];
        
        for (uint r = 0; r < rewardsTokens.length; r++) {
            uint newlyInterestGenerated = timeSinceLastUpdate.mul(rewardsTokens[r].totalReward).div(stakingPeriod);
            updateGlobalYieldPerToken(r, newlyInterestGenerated);
            uint256 interest = calculateInterest(msg.sender);
            stakerData.withdrawnToDate = stakerData.withdrawnToDate.add(interest);
            require(rewardsTokens[r].token.transfer(msg.sender, interest), "Withdraw interest transfer failed");
            emit InterestCollected(msg.sender, interest, interestData.globalYieldPerToken);
        }
        
    }

    /**
     * @dev update Global Yield.
     */
    function updateGlobalYield() public {
        for (uint r = 0; r < rewardsTokens.length; r++) {
            uint timeSinceLastUpdate = _timeSinceLastUpdate();
            uint newlyInterestGenerated = timeSinceLastUpdate.mul(rewardsTokens[r].totalReward).div(stakingPeriod);
            updateGlobalYieldPerToken(r, newlyInterestGenerated);
        }
    }

    /**
     * @dev get Yield Data.
     */
    function getYieldData(address _staker) public view returns(uint256, uint256)
    {

      return (interestData.globalYieldPerToken, interestData.stakers[_staker].stakeBuyinRate);
    }

    /**
     * @dev time Since Last Update.
     */
    function _timeSinceLastUpdate() internal returns(uint256) {
        uint timeSinceLastUpdate;
        if(now.sub(stakingStartTime) > stakingPeriod)
        {
            timeSinceLastUpdate = stakingStartTime.add(stakingPeriod).sub(interestData.lastUpdated);
            interestData.lastUpdated = stakingStartTime.add(stakingPeriod);
        } else {
            timeSinceLastUpdate = now.sub(interestData.lastUpdated);
            interestData.lastUpdated = now;
        }
        return timeSinceLastUpdate;
    }

    /**
     * @dev Calculates Interest for staker for their stake.
     *
     * Formula:
     * EarnedInterest = MAX[TotalStaked x GlobalYield - (StakeBuyinRate + WithdrawnToDate), 0]
     *
     * @param _staker                     Staker's address
     *
     * @return The amount of tokens credit for the staker.
     */
    function calculateInterest(address _staker)
        public
        view
        returns (uint256)
    {
        Staker storage stakerData = interestData.stakers[_staker];

        
        uint256 _withdrawnToDate = stakerData.withdrawnToDate;

        uint256 intermediateInterest = stakerData
            .totalStaked
            .mul(interestData.globalYieldPerToken).div(DECIMAL1e18);

        uint256 intermediateVal = _withdrawnToDate.add(
            stakerData.stakeBuyinRate
        );

        // will lead to -ve value
        if (intermediateVal > intermediateInterest) {
            return 0;
        }

        uint _earnedInterest = (intermediateInterest.sub(intermediateVal));

        return _earnedInterest;
    }

    /**
     * @dev Calculates and updates new accrued amount per token since last update.
     *
     * Formula:
     * GlobalYield = GlobalYield(P) + newlyGeneratedInterest/GlobalTotalStake.
     *
     * @param _interestGenerated  Interest token earned since last update.
     *
     */
    function updateGlobalYieldPerToken(
        uint256 _tokenIndex,
        uint256 _interestGenerated
    ) internal {
        if (interestData.globalTotalStaked == 0) {
            require(rewardsTokens[_tokenIndex].token.transfer(vaultAddress, _interestGenerated), "Transfer failed while trasfering to vault");
            return;
        }
        interestData.globalYieldPerToken = interestData.globalYieldPerToken.add(
            _interestGenerated
                .mul(DECIMAL1e18) 
                .div(interestData.globalTotalStaked) 
        );
    }


    function getStakerData(address _staker) public view returns(uint256, uint256)
    {

      return (interestData.stakers[_staker].totalStaked, interestData.stakers[_staker].withdrawnToDate);
    }



    /**
     * @dev returns stats data.
     * @param _staker Address of staker.
     * @return Total staked.
     * @return Total rewards to be distributed.
     * @return estimated rewards for user at end of staking period if no one stakes from current time.
     * @return Unlocked rewards based on elapsed time.
     * @return Accrued rewards for user till now.
     */
    function getStatsData(address _staker) external view returns(uint, uint[] memory, uint[] memory, uint[] memory, uint[] memory)
    {

        uint[] memory totalRewards = new uint[](rewardsTokens.length);
        uint[] memory estimatedRewards = new uint[](rewardsTokens.length);
        uint[] memory unlockedRewards = new uint[](rewardsTokens.length);
        uint[] memory accruedRewards = new uint[](rewardsTokens.length);

        for (uint r = 0; r < rewardsTokens.length; r++) {
            // 2 Loops : cause got "CompilerError: Stack too deep, try removing local variables."
            totalRewards[r] = rewardsTokens[r].totalReward;
        }

        for (uint r = 0; r < rewardsTokens.length; r++) {
            Staker storage stakerData = interestData.stakers[_staker];
            uint estimatedReward = 0;
            uint unlockedReward = 0;
            uint accruedReward = 0;
            uint timeElapsed = now.sub(stakingStartTime);

            if(timeElapsed > stakingPeriod)
            {
                timeElapsed = stakingPeriod;
            }

            unlockedReward = timeElapsed.mul(rewardsTokens[r].totalReward).div(stakingPeriod);

            uint timeSinceLastUpdate;
            if(timeElapsed == stakingPeriod)
            {
                timeSinceLastUpdate = stakingStartTime.add(stakingPeriod).sub(interestData.lastUpdated);
            } else {
                timeSinceLastUpdate = now.sub(interestData.lastUpdated);
            }
            uint newlyInterestGenerated = timeSinceLastUpdate.mul(rewardsTokens[r].totalReward).div(stakingPeriod);
            uint updatedGlobalYield = 0;
            uint stakingTimeLeft = 0;
            if(now < stakingStartTime.add(stakingPeriod)){
            stakingTimeLeft = stakingStartTime.add(stakingPeriod).sub(now);
            }
            uint interestGeneratedEnd = stakingTimeLeft.mul(rewardsTokens[r].totalReward).div(stakingPeriod);
            uint globalYieldEnd;
            if (interestData.globalTotalStaked != 0) {
                updatedGlobalYield = interestData.globalYieldPerToken.add(
                newlyInterestGenerated
                    .mul(DECIMAL1e18)
                    .div(interestData.globalTotalStaked));

                globalYieldEnd = updatedGlobalYield.add(interestGeneratedEnd.mul(DECIMAL1e18).div(interestData.globalTotalStaked));
            }
            
            accruedReward = stakerData
                .totalStaked
                .mul(updatedGlobalYield).div(DECIMAL1e18);

            if (stakerData.withdrawnToDate.add(stakerData.stakeBuyinRate) > stakerData
                .totalStaked
                .mul(updatedGlobalYield).div(DECIMAL1e18))
            {
                accruedReward = 0;
            } else {

                accruedReward = accruedReward.sub(stakerData.withdrawnToDate.add(stakerData.stakeBuyinRate));
            }

            estimatedReward = stakerData
                .totalStaked
                .mul(globalYieldEnd).div(DECIMAL1e18);
            if (stakerData.withdrawnToDate.add(stakerData.stakeBuyinRate) > estimatedReward) {
                estimatedReward = 0;
            } else {

                estimatedReward = estimatedReward.sub(stakerData.withdrawnToDate.add(stakerData.stakeBuyinRate));
            }

            estimatedRewards[r] = estimatedReward;
            unlockedRewards[r]= unlockedReward;
            accruedRewards[r] = accruedReward;
            
        }

        return (interestData.globalTotalStaked, totalRewards, estimatedRewards, unlockedRewards, accruedRewards);

    }

    /**
    * @dev staken token getter.
    * @return staken token.
    */
    function getStakeToken() external view returns(address){
        return address(stakeToken);
    }

    /**
    * @dev reward token getter.
    * @return reward token.
    */
    function getRewardToken() external view returns(address){
        return address(rewardToken);
    }
}
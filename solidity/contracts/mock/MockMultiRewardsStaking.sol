pragma solidity 0.5.7;

import "../MultiRewardsStaking.sol";
import "../external/openzeppelin-solidity/token/ERC20/ERC20.sol";

contract MockMultiRewardsStaking is MultiRewardsStaking {

  constructor(address _stakeToken, address[] memory _rewardTokens, uint256 stakingPeriod, uint256[] memory _totalRewardToBeDistributed, uint256 startTime, address vaultAdd) 
  public MultiRewardsStaking(_stakeToken, _rewardTokens, stakingPeriod, _totalRewardToBeDistributed, startTime, vaultAdd) {
  }

	function setBuyInRate(address _user, uint _value, ERC20 _token) public
  {
    interestData.stakers[_user].stakeBuyinRate[address(_token)] = _value;
  }

  function addStake(address _user, uint _value) public
  {
    interestData.stakers[_user].totalStaked = _value; 
  }  

  function setInterestData(uint a, uint b, ERC20 _token) public {
    interestData.globalTotalStaked = a;
    interestData.globalYieldPerToken[address(_token)] = b;
  }

  function setStarttime() public {
    stakingStartTime = now;
  }

}

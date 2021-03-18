var Staking = artifacts.require("Staking");
const UniswapETH_Plot = artifacts.require("TokenMock");

const PlotusToken = artifacts.require('PlotXToken');
const MockStaking = artifacts.require('MockStaking');
const BN = web3.utils.BN;
const { toHex, toWei } = require("./utils/ethTools.js");
const increaseTimeTo = require("./utils/increaseTime.js").increaseTimeTo;
const DummyTokenMock = artifacts.require('DummyTokenMock');
const latestTime = require("./utils/latestTime.js").latestTime;


contract("InterestDistribution - Scenario based calculations for staking model", ([S1, S2, S3, vaultAdd]) => {
  let stakeTok,
      plotusToken,
      staking,
      stakeStartTime,
      dummystakeTok,
      dummyRewardTok,
      dummyStaking;

    before(async () => {
      
      stakeTok = await UniswapETH_Plot.new("UEP","UEP");
      plotusToken = await PlotusToken.new(toWei("30000000"), S1);
      dummystakeTok = await DummyTokenMock.new("UEP","UEP");
      dummyRewardTok = await DummyTokenMock.new("PLT","PLT");
      let nowTime = await latestTime();
      staking = await Staking.new(stakeTok.address, plotusToken.address, (24*3600*365), toWei("500000"), (await latestTime())/1 + 1, vaultAdd);

      dummyStaking = await MockStaking.new(dummystakeTok.address, dummyRewardTok.address, (24*3600*365), toWei("500000"), (await latestTime())/1+1500, vaultAdd);

      await plotusToken.transfer(staking.address, toWei("500000"));

      await dummyRewardTok.mint(dummyStaking.address, toWei("500000"));
      await dummystakeTok.mint(dummyStaking.address, toWei("100"));
      
      await stakeTok.mint(S1, toWei("1000"));
      await stakeTok.mint(S2, toWei("1000"));
      await stakeTok.mint(S3, toWei("1000"));
      await stakeTok.approve(staking.address, toWei("10000", "ether"), {
        from: S1
      });
      await stakeTok.approve(staking.address, toWei("10000", "ether"), {
        from: S2
      });
      await stakeTok.approve(staking.address, toWei("10000", "ether"), {
        from: S3
      });

      stakeStartTime = (await staking.stakingStartTime())/1;
      console.log("starttime: ", stakeStartTime);
      
    });
  describe('Multiple Staker stakes, no withdrawal', function() {

    //console.log(JSON.stringify(ERCcontract.abi));
    
    it("Staker 1 stakes 100 Token after 10 seconds", async () => {
      let beforeStakeTokBal = await stakeTok.balanceOf(S1);
      let beforeStakeTokBalStaking = await stakeTok.balanceOf(staking.address);
      let vaultBal = await plotusToken.balanceOf(vaultAdd);
      
      // increase 10 seconds
      await increaseTimeTo(stakeStartTime + 10);


      /**
        * S1 stakes 100 tokens
        */
        await staking.stake(toWei("100"), {
          from: S1
        });
        let vaultBalAfter = await plotusToken.balanceOf(vaultAdd);
        let afterStakeTokBal = await stakeTok.balanceOf(S1);

        let afterStakeTokBalStaking = await stakeTok.balanceOf(staking.address);

        expect((beforeStakeTokBal - afterStakeTokBal)).to.be.equal((toWei("100", "ether"))/1);
        expect((afterStakeTokBalStaking - beforeStakeTokBalStaking)).to.be.equal((toWei("100", "ether"))/1); 


        let stakerData = await staking.getStakerData(S1);
        let interestData = await staking.interestData();
        let yieldData = await staking.getYieldData(S1);

        // 1st stake so globalTotalStake is 0, hence 
        // globalYieldPerToken and gdYieldRate are  0.
        expect((yieldData[0]).toString()).to.be.equal("0");
        expect((yieldData[1]).toString()).to.be.equal("0");

        // globalTotalStake
        expect((interestData[0]).toString()).to.be.equal(toWei("100", "ether")); 
        

        // totalStake of S1
        expect((stakerData[0]).toString()).to.be.equal(toWei("100", "ether")); 

        // the stake token and reward token shall be retrieved
        let stakeTokenAddressFromStaking = await staking.getStakeToken();
        let rewardTokenAddressFromStaking = await staking.getRewardToken();
        console.log("StakeToken Address From Staking" + stakeTokenAddressFromStaking )
        console.log("StakeToken Address From Input" + stakeTok.address)
        console.log("RewardToken Address From Staking" + rewardTokenAddressFromStaking )
        console.log("RewardToken Address From Input" + plotusToken.address)
        expect(stakeTokenAddressFromStaking).to.be.equal(stakeTok.address);
        expect(rewardTokenAddressFromStaking).to.be.equal(plotusToken.address);

        // the stake token balance and reward token balance shall be retrieved
        let stakeTokenFromStaking = MockStaking.at(stakeTok.address);
        let rewardTokenFromStaking = PlotusToken.at(plotusToken.address);

        let stakeTokenBalance = await stakeTok.balanceOf(S1);
        let stakeTokenBalanceRetreived = await stakeTok.balanceOf(S1);
        let rewardTokenBalance = await plotusToken.balanceOf(vaultAdd);
        let rewardTokenBalanceRetreived = await plotusToken.balanceOf(vaultAdd);
       
        expect(stakeTokenBalanceRetreived-stakeTokenBalance).to.be.equal(0);
        expect(rewardTokenBalanceRetreived-rewardTokenBalance).to.be.equal(0);
    });

    
  });

});
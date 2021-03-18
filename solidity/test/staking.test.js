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
    
    it("Check access to staking tokens", async () => {

        // the stake token and reward token shall be retrieved
        let stakeTokenAddressFromStaking = await staking.getStakeToken();
        let rewardTokenAddressFromStaking = await staking.getRewardToken();
        console.log("StakeToken Address From Staking" + stakeTokenAddressFromStaking )
        console.log("StakeToken Address From Input" + stakeTok.address)
        console.log("RewardToken Address From Staking" + rewardTokenAddressFromStaking )
        console.log("RewardToken Address From Input" + plotusToken.address)
        expect(stakeTokenAddressFromStaking).to.be.equal(stakeTok.address);
        expect(rewardTokenAddressFromStaking).to.be.equal(plotusToken.address);
    });

    
  });

});
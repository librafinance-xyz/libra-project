import { ethers } from "hardhat";

import {
  ADDRESS_ZERO,
  duration,
  advanceBlock,
  advanceBlockTo,
  deploy,
  getBigNumber,
  increase,
  prepare,
} from "./utilities";
// const { expect } = require("chai");

describe("Tomb", function () {
  before(async function () {
    await prepare(this, ["Tomb", "TBond", "TShare", "Treasury"]);
  });

  beforeEach(async function () {
    await deploy(this, [["tomb", this.Tomb, [0, this.alice.address]]]);
    await deploy(this, [["bond", this.TBond]]);
    await deploy(this, [["treasury", this.Treasury]]);
    const startTime = Math.floor(Date.now() / 1000);
    const communityFund = this.alice.address;
    const deFund = this.bob.address;
    await deploy(this, [
      ["share", this.TShare, [startTime, communityFund, deFund]],
      ,
    ]);
    // await deploy(this, [["dummy2", this.DummyToken]]);
    // await (await this.sbx.transferOwnership(this.masterchef.address)).wait();
    // const starttime = Math.floor(Date.now() / 1000);
    // await (
    //   await this.masterchef.init(this.sbx.address, starttime, getBigNumber(1))
    // ).wait();
    // await increase(duration.seconds(3));
  });

  it("test", async function () {
    console.log(
      "this.tomb.balanceOf(this.alice.address ): ",
      (await this.tomb.balanceOf(this.alice.address)).toString()
    );

    await (
      await this.tomb.mint(this.alice.address, "1000000000000000000")
    ).wait();
    console.log(
      "this.tomb.balanceOf(this.alice.address ): ",
      (await this.tomb.balanceOf(this.alice.address)).toString()
    );

    // await (
    //   await this.masterchef.addPool(100, this.dummy.address, ADDRESS_ZERO, true)
    // ).wait();
    // expect(await this.dummy.balanceOf(this.alice.address)).to.be.equal(
    //   getBigNumber(0)
    // );
    // expect(await this.dummy2.balanceOf(this.alice.address)).to.be.equal(
    //   getBigNumber(0)
    // );
    // expect(await this.dummy2.balanceOf(this.bob.address)).to.be.equal(
    //   getBigNumber(0)
    // );
    // await (await this.dummy.mint(this.alice.address, getBigNumber(10))).wait();
    // await (await this.dummy2.mint(this.alice.address, getBigNumber(20))).wait();
    // await (await this.dummy2.mint(this.bob.address, getBigNumber(5))).wait();
    // expect(await this.dummy.balanceOf(this.alice.address)).to.be.equal(
    //   getBigNumber(10)
    // );
    // expect(await this.dummy2.balanceOf(this.alice.address)).to.be.equal(
    //   getBigNumber(20)
    // );
    // expect(await this.dummy2.balanceOf(this.bob.address)).to.be.equal(
    //   getBigNumber(5)
    // );
    // await (
    //   await this.dummy.approve(this.masterchef.address, getBigNumber(10))
    // ).wait();
    // // await (
    // //   await this.dummy2.approve(this.masterchef.address, getBigNumber(20))
    // // ).wait();
    // await (
    //   await this.masterchef.deposit(0, getBigNumber(10), this.alice.address)
    // ).wait();
    // expect(
    //   await this.masterchef.pendingReward(0, this.alice.address)
    // ).to.be.equal(getBigNumber(0));
    // // await (
    // //   await this.masterchef.deposit(1, getBigNumber(10), this.alice.address)
    // // ).wait();
    // // expect(
    // //   await this.masterchef.pendingReward(1, this.alice.address)
    // // ).to.be.equal(getBigNumber(0));
    // // // pool 0
    // // console.log(
    // //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    // //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // // );
    // // // pool 1
    // // console.log(
    // //   "await this.masterchef.pendingReward(1, this.alice.address): ",
    // //   (await this.masterchef.pendingReward(1, this.alice.address)).toString()
    // // );
    // await increase(duration.seconds(3600));
    // // pool 0
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // // // pool 1
    // // console.log(
    // //   "await this.masterchef.pendingReward(1, this.alice.address): ",
    // //   (await this.masterchef.pendingReward(1, this.alice.address)).toString()
    // // );
    // console.log(
    //   "await this.sbx.balanceOf(this.bob.address): " +
    //     (await this.sbx.balanceOf(this.bob.address))
    // );
    // await (await this.masterchef.harvest(0, this.bob.address)).wait();
    // console.log(
    //   "await this.sbx.balanceOf(this.bob.address): " +
    //     (await this.sbx.balanceOf(this.bob.address))
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // await increase(duration.seconds(180));
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // // alice withdraw 5 DUMMY
    // await (
    //   await this.masterchef.withdraw(0, getBigNumber(5), this.alice.address)
    // ).wait();
    // console.log(
    //   "await this.masterchef.userInfo(0, this.alice.address: " +
    //     (await this.masterchef.userInfo(0, this.alice.address))
    // );
    // // alice withdraw 5 DUMMY and send it to bob.
    // await (
    //   await this.masterchef.withdraw(0, getBigNumber(5), this.bob.address)
    // ).wait();
    // // bob deposit 5 DUMMY
    // await (
    //   await this.dummy
    //     .connect(this.bob)
    //     .approve(this.masterchef.address, getBigNumber(5))
    // ).wait();
    // await (
    //   await this.masterchef
    //     .connect(this.bob)
    //     .deposit(0, getBigNumber(5), this.bob.address)
    // ).wait();
    // // alice deposit 5 DUMMY to bob
    // await (
    //   await this.dummy
    //     .connect(this.alice)
    //     .approve(this.masterchef.address, getBigNumber(5))
    // ).wait();
    // await (
    //   await this.masterchef
    //     .connect(this.alice)
    //     .deposit(0, getBigNumber(5), this.bob.address)
    // ).wait();
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // await increase(duration.seconds(180));
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // console.log(
    //   "await this.dummy.balanceOf(this.bob.address): " +
    //     (await this.dummy.balanceOf(this.bob.address))
    // );
    // console.log(
    //   "await this.dummy.balanceOf(this.alice.address): " +
    //     (await this.dummy.balanceOf(this.alice.address))
    // );
    // await increase(duration.seconds(180));
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.bob.address): ",
    //   (await this.masterchef.pendingReward(0, this.bob.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.userInfo(0, this.alice.address: " +
    //     (await this.masterchef.userInfo(0, this.alice.address))
    // );
    // console.log(
    //   "await this.masterchef.userInfo(0, this.bob.address: " +
    //     (await this.masterchef.userInfo(0, this.bob.address))
    // );
    // await (
    //   await this.masterchef.connect(this.bob).harvest(0, this.bob.address)
    // ).wait();
    // console.log(
    //   "await this.masterchef.userInfo(0, this.bob.address: " +
    //     (await this.masterchef.userInfo(0, this.bob.address))
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.bob.address): ",
    //   (await this.masterchef.pendingReward(0, this.bob.address)).toString()
    // );
    // await increase(duration.seconds(180));
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.bob.address): ",
    //   (await this.masterchef.pendingReward(0, this.bob.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.poolInfo(0): " +
    //     (await this.masterchef.poolInfo(0))
    // );
    // await (
    //   await this.masterchef.addPool(10, this.dummy2.address, ADDRESS_ZERO, true)
    // ).wait();
    // // alice deposit 1 DUMMY2
    // await (
    //   await this.dummy2
    //     .connect(this.alice)
    //     .approve(this.masterchef.address, getBigNumber(1))
    // ).wait();
    // await (
    //   await this.masterchef.deposit(1, getBigNumber(1), this.alice.address)
    // ).wait();
    // // bob deposit 2 DUMMY2
    // await (
    //   await this.dummy2
    //     .connect(this.bob)
    //     .approve(this.masterchef.address, getBigNumber(2))
    // ).wait();
    // await (
    //   await this.masterchef
    //     .connect(this.bob)
    //     .deposit(1, getBigNumber(2), this.bob.address)
    // ).wait();
    // console.log(
    //   "await this.masterchef.pendingReward(1, this.alice.address): ",
    //   (await this.masterchef.pendingReward(1, this.alice.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(1, this.bob.address): ",
    //   (await this.masterchef.pendingReward(1, this.bob.address)).toString()
    // );
    // await increase(duration.seconds(180));
    // // 180 * 0.6 * 1/11 * 1/3 = 3.272727272727273
    // console.log(
    //   "await this.masterchef.pendingReward(1, this.alice.address): ",
    //   (await this.masterchef.pendingReward(1, this.alice.address)).toString()
    // );
    // // 180 * 0.6 * 1/11 * 2/3 = 6.545454545454545
    // console.log(
    //   "await this.masterchef.pendingReward(1, this.bob.address): ",
    //   (await this.masterchef.pendingReward(1, this.bob.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.bob.address): ",
    //   (await this.masterchef.pendingReward(0, this.bob.address)).toString()
    // );
    // console.log(
    //   "await this.sbx.balanceOf(this.carol.address): " +
    //     (await this.sbx.balanceOf(this.carol.address))
    // );
    // await (
    //   await this.masterchef.connect(this.bob).harvestAll(this.carol.address)
    // ).wait();
    // // around 6545454545454000000 + 208963636363630000000 = around 215...
    // console.log(
    //   "await this.sbx.balanceOf(this.carol.address): " +
    //     (await this.sbx.balanceOf(this.carol.address))
    // );
    // // should be 0
    // console.log(
    //   "await this.masterchef.pendingReward(1, this.bob.address): ",
    //   (await this.masterchef.pendingReward(1, this.bob.address)).toString()
    // );
    // // should be 0
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.bob.address): ",
    //   (await this.masterchef.pendingReward(0, this.bob.address)).toString()
    // );
    // //
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // await (
    //   await this.masterchef.connect(this.alice).harvest(0, this.bob.address)
    // ).wait();
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // await increase(duration.seconds(3));
    // // 0
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // // bob withdraw 1 DUMMY
    // await (
    //   await this.masterchef
    //     .connect(this.bob)
    //     .withdraw(0, getBigNumber(1), this.bob.address)
    // ).wait();
    // // bob has 9 DUMMY on the pool
    // console.log(
    //   "await this.masterchef.userInfo(0, this.bob.address: " +
    //     (await this.masterchef.userInfo(0, this.bob.address))
    // );
    // // alice has 0 DUMMY on the pool
    // console.log(
    //   "await this.masterchef.userInfo(0, this.alice.address: " +
    //     (await this.masterchef.userInfo(0, this.alice.address))
    // );
    // // bob has 2 DUMMY2 on the pool
    // console.log(
    //   "await this.masterchef.userInfo(1, this.bob.address: " +
    //     (await this.masterchef.userInfo(1, this.bob.address))
    // );
    // // alice has 1 DUMMY2 on the pool
    // console.log(
    //   "await this.masterchef.userInfo(1, this.alice.address: " +
    //     (await this.masterchef.userInfo(1, this.alice.address))
    // );
    // // bob deposit 1 DUMMY for alice pool
    // await (
    //   await this.dummy
    //     .connect(this.bob)
    //     .approve(this.masterchef.address, getBigNumber(10))
    // ).wait();
    // await (
    //   await this.masterchef
    //     .connect(this.bob)
    //     .deposit(0, getBigNumber(1), this.alice.address)
    // ).wait();
    // //
    // // bob has 9 DUMMY on the pool
    // console.log(
    //   "await this.masterchef.userInfo(0, this.bob.address: " +
    //     (await this.masterchef.userInfo(0, this.bob.address))
    // );
    // // alice has 1 DUMMY on the pool
    // console.log(
    //   "await this.masterchef.userInfo(0, this.alice.address: " +
    //     (await this.masterchef.userInfo(0, this.alice.address))
    // );
    // console.log(
    //   "await this.masterchef.poolInfo(0): " +
    //     (await this.masterchef.poolInfo(0))
    // );
    // console.log(
    //   "await this.masterchef.poolInfo(1): " +
    //     (await this.masterchef.poolInfo(1))
    // );
    // console.log(
    //   "rewardPerSecond: ",
    //   (await this.masterchef.rewardPerSecond()).toString()
    // );
    // //
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.bob.address): ",
    //   (await this.masterchef.pendingReward(0, this.bob.address)).toString()
    // );
    // await increase(duration.seconds(3));
    // // 3 * 0.6 * 10/11 * 1/10 = 0.163636363636364
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.bob.address): ",
    //   (await this.masterchef.pendingReward(0, this.bob.address)).toString()
    // );
    // console.log(
    //   "rewardPerSecond: ",
    //   (await this.masterchef.rewardPerSecond()).toString()
    // );
    // await (
    //   await this.masterchef
    //     .connect(this.alice)
    //     .updateEmissionRate(getBigNumber(3), true)
    // ).wait();
    // //
    // console.log(
    //   "rewardPerSecond: ",
    //   (await this.masterchef.rewardPerSecond()).toString()
    // );
    // await (
    //   await this.masterchef.connect(this.bob).harvestAll(this.carol.address)
    // ).wait();
    // await (
    //   await this.masterchef.connect(this.alice).harvestAll(this.carol.address)
    // ).wait();
    // await increase(duration.seconds(3));
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.bob.address): ",
    //   (await this.masterchef.pendingReward(0, this.bob.address)).toString()
    // );
    // // reward 0
    // await (
    //   await this.masterchef
    //     .connect(this.alice)
    //     .updateEmissionRate(getBigNumber(0), true)
    // ).wait();
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.bob.address): ",
    //   (await this.masterchef.pendingReward(0, this.bob.address)).toString()
    // );
    // // harvest all
    // await (
    //   await this.masterchef.connect(this.bob).harvestAll(this.carol.address)
    // ).wait();
    // await (
    //   await this.masterchef.connect(this.alice).harvestAll(this.carol.address)
    // ).wait();
    // await increase(duration.seconds(3));
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.bob.address): ",
    //   (await this.masterchef.pendingReward(0, this.bob.address)).toString()
    // );
    // // setPool 0
    // await (
    //   await this.masterchef
    //     .connect(this.alice)
    //     .setPool(0, 0, ADDRESS_ZERO, false, true)
    // ).wait();
    // await (
    //   await this.masterchef
    //     .connect(this.alice)
    //     .updateEmissionRate(getBigNumber(1), true)
    // ).wait();
    // await increase(duration.seconds(3));
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.bob.address): ",
    //   (await this.masterchef.pendingReward(0, this.bob.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(1, this.alice.address): ",
    //   (await this.masterchef.pendingReward(1, this.alice.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(1, this.bob.address): ",
    //   (await this.masterchef.pendingReward(1, this.bob.address)).toString()
    // );
    // // setPool 0
    // await (
    //   await this.masterchef
    //     .connect(this.alice)
    //     .setPool(0, 10, ADDRESS_ZERO, false, true)
    // ).wait();
    // console.log(
    //   "await this.masterchef.poolInfo(0): " +
    //     (await this.masterchef.poolInfo(0))
    // );
    // console.log(
    //   "await this.masterchef.poolInfo(1): " +
    //     (await this.masterchef.poolInfo(1))
    // );
    // await (
    //   await this.masterchef.connect(this.bob).harvestAll(this.carol.address)
    // ).wait();
    // await (
    //   await this.masterchef.connect(this.alice).harvestAll(this.carol.address)
    // ).wait();
    // await increase(duration.seconds(3));
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.alice.address): ",
    //   (await this.masterchef.pendingReward(0, this.alice.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(0, this.bob.address): ",
    //   (await this.masterchef.pendingReward(0, this.bob.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(1, this.alice.address): ",
    //   (await this.masterchef.pendingReward(1, this.alice.address)).toString()
    // );
    // console.log(
    //   "await this.masterchef.pendingReward(1, this.bob.address): ",
    //   (await this.masterchef.pendingReward(1, this.bob.address)).toString()
    // );
    // console.log(
    //   "await this.sbx.balanceOf(this.dev.address): " +
    //     (await this.sbx.balanceOf(this.dev.address))
    // );
    // await (
    //   await this.masterchef.connect(this.bob).harvestAll(this.dev.address)
    // ).wait();
    // await (
    //   await this.masterchef.connect(this.alice).harvestAll(this.dev.address)
    // ).wait();
    // // should be 3.
    // console.log(
    //   "await this.sbx.balanceOf(this.dev.address): " +
    //     (await this.sbx.balanceOf(this.dev.address))
    // );
  });
});

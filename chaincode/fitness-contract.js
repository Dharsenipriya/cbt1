/*
  chaincode/fitness-contract.js
  Hyperledger Fabric chaincode (JavaScript) for tracking fitness club members and rewards.
*/

'use strict';

const { Contract } = require('fabric-contract-api');

class FitnessContract extends Contract {

  async initLedger(ctx) {
    const members = [
      { memberId: 'M001', name: 'Alice', points: 100 },
      { memberId: 'M002', name: 'Bob',   points: 50  }
    ];
    for (const m of members) {
      await ctx.stub.putState(m.memberId, Buffer.from(JSON.stringify(m)));
    }
  }

  async createMember(ctx, memberId, name) {
    const exists = await this._memberExists(ctx, memberId);
    if (exists) {
      throw new Error(`Member ${memberId} already exists`);
    }
    const member = { memberId, name, points: 0 };
    await ctx.stub.putState(memberId, Buffer.from(JSON.stringify(member)));
    return JSON.stringify(member);
  }

  async awardPoints(ctx, memberId, amountStr) {
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Amount must be a positive integer');
    }
    const memberBytes = await ctx.stub.getState(memberId);
    if (!memberBytes || memberBytes.length === 0) {
      throw new Error(`Member ${memberId} does not exist`);
    }
    const member = JSON.parse(memberBytes.toString());
    member.points += amount;
    await ctx.stub.putState(memberId, Buffer.from(JSON.stringify(member)));
    return JSON.stringify(member);
  }

  async redeemPoints(ctx, memberId, amountStr) {
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Amount must be a positive integer');
    }
    const memberBytes = await ctx.stub.getState(memberId);
    if (!memberBytes || memberBytes.length === 0) {
      throw new Error(`Member ${memberId} does not exist`);
    }
    const member = JSON.parse(memberBytes.toString());
    if (member.points < amount) {
      throw new Error('Insufficient points');
    }
    member.points -= amount;
    await ctx.stub.putState(memberId, Buffer.from(JSON.stringify(member)));
    return JSON.stringify(member);
  }

  async transferPoints(ctx, fromId, toId, amountStr) {
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      throw new Error('Amount must be a positive integer');
    }
    const fromBytes = await ctx.stub.getState(fromId);
    const toBytes = await ctx.stub.getState(toId);
    if (!fromBytes || fromBytes.length === 0) throw new Error(`From ${fromId} not found`);
    if (!toBytes || toBytes.length === 0) throw new Error(`To ${toId} not found`);
    const from = JSON.parse(fromBytes.toString());
    const to = JSON.parse(toBytes.toString());
    if (from.points < amount) throw new Error('Insufficient points to transfer');
    from.points -= amount;
    to.points += amount;
    await ctx.stub.putState(fromId, Buffer.from(JSON.stringify(from)));
    await ctx.stub.putState(toId, Buffer.from(JSON.stringify(to)));
    return JSON.stringify({ from, to });
  }

  async queryMember(ctx, memberId) {
    const memberBytes = await ctx.stub.getState(memberId);
    if (!memberBytes || memberBytes.length === 0) {
      throw new Error(`Member ${memberId} does not exist`);
    }
    return memberBytes.toString();
  }

  async _memberExists(ctx, memberId) {
    const b = await ctx.stub.getState(memberId);
    return b && b.length > 0;
  }
}

module.exports = FitnessContract;

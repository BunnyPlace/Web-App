import { db, toResult } from "@/services/db";
import { findUser, useTokens } from "./user";

export type BoostType = "free" | "paid" | "paid-no-levels";

export interface Boost {
  type: BoostType;
  boostId: number;
  totalPerDay?: number;
  usedToday?:number; 
  lastUsed ?:Date
  level?: number;
  maximumLevel?:number 
  cost?: number; 
  userId: number;
}

export async function createUserBoost(userId: number): Promise<void> {
  const boosts: Boost[] = [
    { type: "free", boostId: 1, totalPerDay: 3, usedToday:0,  userId },
    { type: "free", boostId: 2, totalPerDay: 3, usedToday:0, userId },
    { type: "paid", boostId: 3, level: 0, cost: 250, maximumLevel:10, userId },
    { type: "paid", boostId: 4, level: 0, cost: 1000, maximumLevel:10, userId },
    { type: "paid", boostId: 5, level: 0, cost: 500, maximumLevel:5, userId },
    { type: "paid-no-levels", boostId: 6 , cost: 200000, userId },
  ];

  await Promise.all(boosts.map(boost => db.boost.add(()=> boost)));
}

export async function useFreeBoost(userId: number, boostId: number): Promise<void> {
  let user = await findUser(userId.toString())

  if(!user){
    throw new Error("Paid boost not found for the user");
  }

  const boostSnapshot = await db.boost.query(
    ($) => [$.field("userId").eq(userId), $.field("boostId").eq(boostId)]
  );
  const boostDoc = boostSnapshot[0];

  if (!boostDoc) {
    throw new Error("Free boost not found for the user");
  }

  const boostData = toResult<Boost>(boostDoc)

  if (boostData.totalPerDay === 0) {
    // User has already used all available boosts for the day
    throw new Error("No available boosts remaining for the day");
  }

  if(boostData.totalPerDay ){
    const updatedTotalPerDay =  boostData.totalPerDay - 1 || 0
    await db.boost.update(boostDoc.ref.id, { totalPerDay: updatedTotalPerDay });
    // Update the last use date
    const now = new Date();
    await db.boost.update(boostDoc.ref.id, { lastUsed: now });
  }
}

export async function usePaidBoost(userId: number, boostId: number): Promise<void> {
  let user = await findUser(userId.toString())

  if(!user){
    throw new Error("Paid boost not found for the user");
  }

  const boostSnapshot = await db.boost.query(
    ($) => [$.field("userId").eq(userId), $.field("boostId").eq(boostId)]
  );
  const boostDoc = boostSnapshot[0];

  if (!boostDoc) {
    throw new Error("Paid boost not found for the user");
  }

  const boostData = toResult<Boost>(boostDoc);

  if (!boostData.level) {
    throw new Error("Paid boost level not specified");
  }

  if(boostData.level && boostData.cost && boostData.maximumLevel && boostData.level < boostData.maximumLevel ){
    await useTokens(userId.toString(),boostData.cost)
    await db.boost.update(boostDoc.ref.id, { level: boostData.level + 1, cost: boostData.cost * 2  });
  }
}

export async function usePaidNoLevelBoost(userId: number, boostId: number): Promise<void> {
  let user = await findUser(userId.toString())

  if(!user){
    throw new Error("Paid boost not found for the user");
  }

  const boostSnapshot = await db.boost.query(
    ($) => [$.field("userId").eq(userId), $.field("boostId").eq(boostId)]
  );
  const boostDoc = boostSnapshot[0];

  if (!boostDoc) {
    throw new Error("Paid boost not found for the user");
  }

  const boostData = toResult<Boost>(boostDoc);


  if(boostData.cost){
     await useTokens(userId.toString(),boostData.cost)
     await db.boost.update(boostDoc.ref.id, { cost: boostData.cost * 2  });
  }
}


export async function getAllUserFreeBoosts(userId: number): Promise<Boost[]> {
  let user = await findUser(userId.toString())

  if(!user){
    throw new Error("Paid boost not found for the user");
  }
  // Query the database for all free boosts associated with the user ID
  const boostSnapshot = await db.boost.query(
    ($) => [$.field("userId").eq(userId), $.field("type").eq("free")]
  );
  const boosts: Boost[] = boostSnapshot.map((boostDoc) => toResult<Boost>(boostDoc));

  return boosts;
}

export async function getAllUserPaidBoosts(userId: number): Promise<Boost[]> {
  let user = await findUser(userId.toString())

  if(!user){
    throw new Error("Paid boost not found for the user");
  }
  // Query the database for all free boosts associated with the user ID
  const boostSnapshot = await db.boost.query(
    ($) => [$.field("userId").eq(userId), $.field("type").eq("paid")]
  );
  const boosts: Boost[] = boostSnapshot.map((boostDoc) => toResult<Boost>(boostDoc));
  return boosts;
}

export async function getAllUserPaidNoLevelsBoosts(userId: number): Promise<Boost[]> {
  let user = await findUser(userId.toString())

  if(!user){
    throw new Error("Paid boost not found for the user");
  }
  // Query the database for all free boosts associated with the user ID
  const boostSnapshot = await db.boost.query(
    ($) => [$.field("userId").eq(userId), $.field("type").eq("paid-no-levels")]
  );
  const boosts: Boost[] = boostSnapshot.map((boostDoc) => toResult<Boost>(boostDoc));
  return boosts;
}

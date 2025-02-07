////////////////////Cuong////////////////////////////////
export type ToDoItem = {
    id: number;
    value: string;
};
////////////////////Cuong////////////////////////////////
export type share_page = {
    share_Id: number;
    type: number;
    title: string;
    tags: string;
    address: string;
    picture: string;
    expiration: string;
};
////////////////////Cuong////////////////////////////////
export type deal_page = {
    deal_Id: number;
    title: string;
    description: string;
    picture: string;
    date_created?: string; 
  };
  

////////////////////Cuong////////////////////////////////
export type request_page = {
    share_Id: number;
    user_Id: number;
    description: string;
};

////////////////////Cuong////////////////////////////////
export type userD = {
    user_Id: number;
    name: string;
    birthday: string;
    email: string;
    phone_Number: number;
    address: string;
    followers: string;
    following: string;
    redeemed_Coupons: string
    bio: string;
    pf: string;
    share_Posts: string;
    explore_Posts: string;
}

////////////////////Nicole////////////////////////////////
export interface comment {
    comment_Id: number;
    explore_Id: number;
    user_Name: string;
    comment_Text: string;
    parent_comment_id?: number | null;
    like_count: number; 
  }
  
////////////////////Nicole////////////////////////////////
export type explore_page = {
explore_Id: number;
title: string;
description: string;
picture: string;
date_created: string; // or any other fields you need
type:number;
user_Id: number;
};
  
  
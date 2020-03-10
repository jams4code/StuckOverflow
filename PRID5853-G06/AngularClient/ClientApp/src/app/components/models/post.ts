import {  Tag  } from "../models/Tag";
import {  Author  } from "../models/Author";
import {  Vote  } from "../models/Vote";
import { Comment } from "../models/comment";

export class Post {
    id: number;
    title: string;
    body: string;
    timestamp: Date;
    editTimeStamp : Date;
    replies: Post[] = [];
    nbReplies : number;
    acceptedAnswerId: number;
    author: Author;
    comments: Comment[] = [];
    score: number;
    lastActivityTimeStamp : Date;
    tags: Tag[] = [];
    votes: Vote[];
    nbViews: number;
    parentId : number;

    constructor(id = 0, title = "", body = "", timestamp = new Date(), editTimeStamp = null, replies = [], nbReplies = 0, acceptedAnswerId = null, author = null, comments = [], score = 0, nbViews = 0, lastActivityTimeStamp = null, tags = [], votes = [], parentId = 0){
        this.id = id;
        this.title = title;
        this.body = body;
        this.timestamp = timestamp;
        this.editTimeStamp = editTimeStamp;
        this.replies = replies;
        this.nbReplies = nbReplies;
        this.acceptedAnswerId = acceptedAnswerId;
        this.author = author;
        this.comments = comments;
        this.score = score;
        this.nbViews = nbViews;
        this.lastActivityTimeStamp = lastActivityTimeStamp;
        this.tags = tags;
        this.votes = votes;
        this.parentId = parentId;
    }
    

}


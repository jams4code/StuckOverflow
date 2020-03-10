import { Author } from "./Author";

export class Comment {
    id: number;
    body: string;
    timestamp: Date;
    editTimeStamp : Date;
    postId: number;
    authorId: number;
    author : Author;


    constructor(id = 0, body = "", timestamp = new Date(), editTimeStamp = null, postId = 0, authorId = 0, author = null){
        this.id = id;
        this.body = body;
        this.timestamp = timestamp;
        this.editTimeStamp = editTimeStamp;
        this.postId = postId;
        this.authorId = authorId;
        this.author = author;
    }
}
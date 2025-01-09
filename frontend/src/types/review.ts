import { Album } from "./album";
import { User } from "./user";

export interface Review {
    id: string;
    rate: number;
    content: string;
    status: string;
    createDate: Date;
    album: Pick<Album, 'albumTitle'> & {
        author: Pick<Album['author'], 'name'>
    };
    author: Pick<User, 'firstName' | 'lastName' | 'avatar'>;
}

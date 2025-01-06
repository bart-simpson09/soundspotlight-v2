import {Author} from "./author";
import {Language} from "./language";
import {Category} from "./category";
import {User} from "./user";

export interface Album {
    id: string;
    albumTitle: string;
    numberOfSongs: number;
    description: string;
    avgRate: number;
    coverImageURL: string;
    releaseDate: Date;
    uploadDate: Date;
    author: Author;
    language: Language;
    category: Category;
    status: string;
    addedBy: User;
    isFavorite: boolean;
}
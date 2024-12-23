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
    coverImageUrl: string;
    releaseDate: Date;
    uploadDate: Date;
    authorId: Author;
    languageId: Language;
    categoryId: Category;
    status: string;
    addedById: User;
}
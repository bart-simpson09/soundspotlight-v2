import {Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import {User} from "./user.entity";
import {Album} from "./album.entity";

@Entity({name: 'favorites'})
export class Favorite {
    @PrimaryGeneratedColumn("uuid", {name: 'id'})
    id: string;

    @ManyToOne(() => User, user => user.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    user: User;

    @ManyToOne(() => Album, album => album.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'album_id'})
    album: Album;
}
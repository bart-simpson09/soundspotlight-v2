import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Album} from "./album.entity";

@Entity({name: 'authors'})
export class Author {
    @PrimaryGeneratedColumn("uuid", {name: 'id'})
    id: string;

    @Column({name: 'name', unique: true})
    name: string;

    @OneToMany(() => Album, album => album.author)
    albums: Album[];
}
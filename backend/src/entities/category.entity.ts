import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Album} from "./album.entity";

@Entity({name: 'categories'})
export class Category {
    @PrimaryGeneratedColumn("uuid", {name: 'id'})
    id: string;

    @Column({name: 'name', unique: true})
    name: string;

    @OneToMany(() => Album, album => album.category)
    albums: Album[];
}
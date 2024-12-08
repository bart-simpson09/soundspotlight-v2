import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

export enum Role {
    admin = 'admin',
    user = 'user',
}

@Entity({name: 'users'})
export class User {
    @PrimaryGeneratedColumn("uuid", {name: 'id'})
    id: string;

    @Column({name: 'email', unique: true})
    email: string;

    @Column({name: 'password'})
    password: string;

    @Column({name: 'first_name'})
    firstName: string;

    @Column({name: 'last_name'})
    lastName: string;

    @Column({name: 'avatar'})
    avatar: string;

    @Column({name: 'role', default: Role.user})
    role: Role;
}
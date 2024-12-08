import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from 'typeorm';
import {Album} from "./album.entity";
import {User} from "./user.entity";

export enum ReviewStatus {
    pending = 'pending',
    approved = 'approved',
    rejected = 'rejected',
}

@Entity({name: 'reviews'})
export class Review {
    @PrimaryGeneratedColumn("uuid", {name: 'id'})
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({name: 'author_id'})
    author: User;

    @ManyToOne(() => Album, album => album.id, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'album_id'})
    album: Album;

    @Column({name: 'create_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createDate: Date;

    @Column({name: 'rate', type: 'int'})
    rate: number;

    @Column({name: 'content', type: 'text'})
    content: string;

    @Column({name: 'status', type: 'enum', enum: ReviewStatus, default: ReviewStatus.pending})
    status: ReviewStatus;
}
import {Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn} from 'typeorm';
import {Author} from "./author.entity";
import {Language} from "./language.entity";
import {Category} from "./category.entity";
import {Review} from "./review.entity";
import {User} from "./user.entity";

export enum AlbumStatus {
    pending = 'pending',
    published = 'published',
    rejected = 'rejected',
}

@Entity({name: 'albums'})
export class Album {
    @PrimaryGeneratedColumn("uuid", {name: 'id'})
    id: string;

    @Column({name: 'album_title', unique: true})
    albumTitle: string;

    @ManyToOne(() => Author, author => author.albums)
    @JoinColumn({name: 'author_id'})
    author: Author;

    @ManyToOne(() => Language)
    @JoinColumn({name: 'language_id'})
    language: Language;

    @ManyToOne(() => Category)
    @JoinColumn({name: 'category_id'})
    category: Category;

    @OneToMany(() => Review, review => review.album, {cascade: true})
    reviews: Review[];

    @Column({name: 'number_of_songs'})
    numberOfSongs: number;

    @Column({name: 'description', type: 'text'})
    description: string;

    @Column({ type: 'double precision', default: () => '0' })
    avgRate: number;

    @Column({name: 'cover_image_url'})
    coverImageURL: string;

    @Column({name: 'release_date', type: "date"})
    releaseDate: Date;

    @Column({name: 'upload_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    uploadDate: Date;

    @ManyToOne(() => User, user => user.albums)
    @JoinColumn({name: 'added_by_id'})
    addedBy: User;

    @Column({name: 'status', type: 'enum', enum: AlbumStatus, default: AlbumStatus.pending})
    status: AlbumStatus;
}
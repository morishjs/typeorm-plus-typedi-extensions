import {Entity, PrimaryGeneratedColumn, Column} from "typeorm-plus";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    text: string;

}

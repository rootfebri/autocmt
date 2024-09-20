import {Column, Entity, PrimaryGeneratedColumn} from "typeorm"

@Entity()
export class Chrome {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    fullPath: string
    @Column()
    facebook: boolean
    @Column()
    instagram: boolean
    @Column()
    twitter: boolean
}

/* eslint-disable indent */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
    @Prop({ unique: true, required: true })
    userName: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false })
    contacts?: Array<string>;

    @Prop({ required: false })
    onlineState?: string;
}

@Schema()
export class Contact {
    @Prop({ required: true })
    userName: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

export const UserSchema = SchemaFactory.createForClass(User);

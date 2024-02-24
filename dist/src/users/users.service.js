"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const hashing_1 = require("../../hashing");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    createUser(createUserDTO) {
        const newUser = new this.userModel(createUserDTO);
        return newUser.save();
    }
    async userExists(userName) {
        const foundUser = await this.userModel
            .findOne({
            userName: userName,
        })
            .exec();
        if (!foundUser) {
            return false;
        }
        return true;
    }
    async addContact(userName, contactName) {
        const user = await this.userModel.findOne({ userName }).exec();
        let updatedContacts = [];
        if (user.contacts.includes(contactName)) {
            updatedContacts = user.contacts;
            return false;
        }
        else if (!user.contacts || user.contacts.length < 1) {
            updatedContacts = [contactName];
        }
        else {
            updatedContacts = user.contacts;
            updatedContacts.push(contactName);
        }
        await this.userModel.findOneAndUpdate({
            userName,
        }, { contacts: updatedContacts }, { new: true });
        return true;
    }
    async findUser(user) {
        const foundUser = await this.userModel
            .findOne({
            userName: user.userName,
        })
            .exec();
        if (!foundUser) {
            return false;
        }
        const isUser = await (0, hashing_1.isHashValid)(user.password, foundUser.password);
        return isUser;
    }
    async getUserInfo(userName) {
        const foundUser = await this.userModel
            .findOne({
            userName,
        })
            .exec();
        if (!foundUser)
            return { isUser: false, userInfo: null };
        return {
            isUser: true,
            userInfo: {
                name: foundUser.userName,
                contacts: foundUser.contacts,
            },
        };
    }
    async removeContact(removeFrom, userName, res) {
        const userId = await this.userModel.findOne({ userName: removeFrom });
        try {
            await this.userModel.findByIdAndUpdate(userId, {
                $pull: { contacts: userName },
            });
            return res.sendStatus(200);
        }
        catch (err) {
            throw new common_1.HttpException('Failed to update user data', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteUser(userName, res) {
        try {
            await this.userModel.deleteOne({ userName });
            res.cookie('secret-access-token', '', {
                httpOnly: true,
                expires: new Date(0),
            });
            return res.status(204).send();
        }
        catch (err) {
            throw new common_1.HttpException('server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UsersService = UsersService;
__decorate([
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "removeContact", null);
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map
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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const CreateUser_dto_1 = require("./DTO/CreateUser.dto");
const hashing_1 = require("../../hashing");
const ContactDTO_1 = require("./DTO/ContactDTO");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createUser(createUserDTO) {
        const hashedUser = {
            userName: createUserDTO.userName,
            password: await (0, hashing_1.hashString)(createUserDTO.password),
        };
        return this.usersService.createUser(hashedUser);
    }
    async loginUser(res, userInfo) {
        const isUser = await this.usersService.findUser(userInfo);
        if (!isUser) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.FORBIDDEN);
        }
        const jwt = (0, hashing_1.getJWTToken)(userInfo.userName);
        if (!jwt)
            res.sendStatus(500);
        res.cookie('secret-access-token', jwt, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.sendStatus(200);
    }
    authorization(req, res) {
        const cookie = req.cookies['secret-access-token'];
        if (!req.cookies || !cookie)
            return res.sendStatus(400);
        const { isValid, userName } = (0, hashing_1.verifyJWT)(cookie);
        res.status(isValid ? 200 : 403).send({ currentUserName: userName });
    }
    async info(req, res) {
        const cookie = req.cookies['secret-access-token'];
        if (!cookie || !req.cookies)
            return 400;
        const { isValid, userName } = (0, hashing_1.verifyJWT)(cookie);
        if (!isValid)
            return res.sendStatus(403);
        const { isUser, userInfo } = await this.usersService.getUserInfo(userName);
        if (!isUser)
            return res.sendStatus(404);
        return res.status(200).send({ userInfo });
    }
    async addContact(contactDTO, req, res) {
        const cookie = req.cookies['secret-access-token'];
        const { isValid, userName } = (0, hashing_1.verifyJWT)(cookie);
        if (!isValid) {
            return res.sendStatus(403);
        }
        if (!req.cookies || !cookie) {
            return res.sendStatus(400);
        }
        const userExists = await this.usersService.userExists(userName);
        const contactExists = await this.usersService.userExists(contactDTO.userName);
        if (!userExists || !contactExists) {
            return res.status(400).send("user doesn't exist");
        }
        const result = await this.usersService.addContact(userName, contactDTO.userName);
        if (result) {
            return res.status(200).send('Friend added successfully');
        }
        return res.status(400).send('Friend already exists');
    }
    async methodName(body, res) {
        if (!body.userName || !body.name)
            return res.sendStatus(400);
        if (!(await this.usersService.userExists(body.userName))) {
            return res.sendStatus(403);
        }
        return this.usersService.removeContact(body.userName, body.name, res);
    }
    async deleteUser(userName, res) {
        return await this.usersService.deleteUser(userName, res);
    }
    endSession(res) {
        res.cookie('secret-access-token', '', {
            httpOnly: true,
            maxAge: 0,
        });
        res.sendStatus(204);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe()),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUser_dto_1.CreateUserDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)('login'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('userInfo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateUser_dto_1.CreateUserDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Get)('authorization'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "authorization", null);
__decorate([
    (0, common_1.Get)('info'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "info", null);
__decorate([
    (0, common_1.Patch)('add-contact'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ContactDTO_1.ContactDTO, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addContact", null);
__decorate([
    (0, common_1.Patch)('remove-friend'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "methodName", null);
__decorate([
    (0, common_1.Delete)('delete-user'),
    __param(0, (0, common_1.Query)('userName')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Delete)('end-session'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "endSession", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map
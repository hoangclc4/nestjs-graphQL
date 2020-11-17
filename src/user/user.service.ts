import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaDTO } from 'src/idea/idea.dto';
import { IdeaEntity } from 'src/idea/idea.entity';
import { Repository } from 'typeorm';
import { UserDTO, UserRO } from './user.dto';
import { UserEntity } from './user.entity';
import axios from "axios";
import { config } from "./config";
import * as gmo from "gmo";
import * as co from "co";
import * as Q from "q";

export const shop = new gmo.ShopAPI({
  host: config.SHOP_CONFIG.development.host,
  shop_id: config.SHOP_CONFIG.development.id,
  shop_pass: config.SHOP_CONFIG.development.password,
});
export const site = new gmo.SiteAPI({
  host: config.SITE_CONFIG.development.host,
  site_id: config.SITE_CONFIG.development.id,
  site_pass: config.SITE_CONFIG.development.password,
});
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(IdeaEntity)
    private ideaRepository: Repository<IdeaEntity>,
  ) {}
  async findAllUser() {
    const users = await this.userRepository.find({
      relations: ['ideas', 'bookmarks'],
    });
    return users.map(user => user.toResponseObject());
  }
  async findUser(username: string) {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['ideas', 'bookmarks'],
    });
    return user.toResponseObject();
  }
  async login(data: UserDTO) {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    console.log(await user.comparePassword(password));
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject();
  }
  
  async register(data: UserDTO) {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user)
      throw new HttpException(
        'Username is already exist',
        HttpStatus.BAD_REQUEST,
      );
    const newUser = this.userRepository.create(data);
    await this.userRepository.save(newUser);
    return newUser.toResponseObject();
  }
  async bookmark(ideaId: string, userId: string) {
    const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });
    if (await user.bookmarks.find(bookmark => bookmark.id == ideaId)) {
      throw new HttpException(
        'Idea has already bookmarked',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.bookmarks.push(idea);
    await this.userRepository.save(user);
    return user.toResponseObject(false);
  }
  async unbookmark(ideaId: string, userId: string) {
    const idea = await this.ideaRepository.findOne({ where: { id: ideaId } });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['bookmarks'],
    });
    if (!(await user.bookmarks.find(bookmark => bookmark.id == ideaId))) {
      throw new HttpException(
        'Idea was not exist to bookmark',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.bookmarks = await user.bookmarks.filter(
      bookmark => bookmark.id !== ideaId,
    );
    await this.userRepository.save(user);
    return user.toResponseObject(false);
  }


  async handleMemberInformation(memberId:number){
    let memberInformationResponse: any;
  try {
    ///111

    const postData = {
      params: {
        MemberID: memberId,
        SiteID: config.SITE_CONFIG.development.id,
        SitePass: config.SITE_CONFIG.development.password,
      },
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    };
    const path="https://kt01.mul-pay.jp/payment/GetLinkplusUrlMember.idPass"
    // const path="https://kt01.mul-pay.jp/payment/SearchMember.json"
    const data={
      geturlparam:{
        ShopID:"tshop00041159",
        ShopPass:"dvcar337",
        CustomerName:"Hello World",
        TemplateNo:"1"
      },
      configid: "001",
      member: {
        MemberID: "123456",
        Cardeditno: "mp123456"
      }
  }
    axios({
      method: 'post',
      url:path,
      headers:postData.headers,
      params:postData.params,
      data:data
    }).then((res) => {
          console.log("RESPONSE RECEIVED: ", res.data);
        })
        .catch((err) => {
          console.log("AXIOS ERROR: ", err);
        });
    // await axios
    //   .post("https://kt01.mul-pay.jp/payment/SearchMember.idPass", postData)
    //   //await axios.get('https://kt01.mul-pay.jp/payment/SearchMember.idPass', postData)
    //   .then((res) => {
    //     console.log("RESPONSE RECEIVED: ", res);
    //     // memberInformationResponse = {
    //     //   memberId: memberGmo.result.MemberID,
    //     //   memberName: memberGmo.result.MemberName,
    //     //   deleteFlag: memberGmo.result.DeleteFlag,
    //     // }
    //   })
    //   .catch((err) => {
    //     console.log("AXIOS ERROR: ", err);
    //   });

    // const memberGmo = await searchMember(memberId);
    // console.log(memberGmo)
    // if (memberGmo.status) {
    //   memberInformationResponse = {
    //       memberId: memberGmo.result.MemberID,
    //       memberName: memberGmo.result.MemberName,
    //       deleteFlag: memberGmo.result.DeleteFlag,
    //     }
    // } else {
    //   memberInformationResponse = {
    //     memberId:null,
    //       memberName: "Member ID does not exist.",
    //       deleteFlag: null,
      
    //     }
    // }
  } catch (error) {
    console.log("err")

    return {error:"err"};
  }
  return memberInformationResponse;

}
}

export async function searchMember(memberId) {
  const response = await co(async () => {
    const result = await Q.ninvoke(site, "searchMember", {
      member_id: memberId,
    });

    return {
      status: true,
      result,
    };
  }).catch((e) => {
    return {
      status: false,
      error: e,
    };
  });

  return response;
}
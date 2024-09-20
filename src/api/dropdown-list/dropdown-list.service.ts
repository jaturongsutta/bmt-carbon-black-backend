import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Predefine } from 'src/entity/predefine.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DropdownListService {
  constructor(
    @InjectRepository(Predefine)
    private predefineRepository: Repository<Predefine>,
  ) {}

  async getPredefindAll() {
    const sql = `select predefine_group , predefine_group + ' : ' + display as display from (select predefine_group, max(description) display from co_predefine where is_active = 'Y' group by predefine_group) x`;
    return await this.predefineRepository.query(sql);
    // return this.predefineRepository.findBy({Predefine_Group : group , Is_Active : 'Y'});
  }

  async getPredefine(group: string, language: string) {
    const sql = `SELECT predefine_group, predefine_cd as value, case when '${language}' = 'TH' then Value_TH else Value_EN end as text 
    ,predefine_cd , Value_TH , Value_EN
    FROM co_predefine WHERE predefine_group = '${group}' and is_active = 'Y'   `;
    return await this.predefineRepository.query(sql);
    // return this.predefineRepository.findBy({Predefine_Group : group , Is_Active : 'Y'});
  }

  async getMenu(language: string) {
    const menus = [{ value: '', text: 'ROOT' }];
    const col = language === 'EN' ? 'Menu_Name_EN' : 'Menu_Name_TH';
    let qry = `SELECT Menu_No as value , ${col} as  text FROM um_menu where Main_Menu_No  is null`;
    const root_menu = await this.predefineRepository.query(qry);
    if (typeof root_menu !== 'undefined') {
      for (let i = 0; i < root_menu.length; i++) {
        const main = root_menu[i];
        menus.push(main);

        qry = `SELECT Menu_No as value , ' - ' + ${col} as  text FROM um_menu where Main_Menu_No  = '${main.value}'`;
        const childMenu = await this.predefineRepository.query(qry);
        if (typeof childMenu !== 'undefined') {
          for (let j = 0; j < childMenu.length; j++) {
            const cm = childMenu[j];
            menus.push(cm);
          }
        }
      }
    }
    return menus;
  }
}

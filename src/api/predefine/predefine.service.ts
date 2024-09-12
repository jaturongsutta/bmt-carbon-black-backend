import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { Predefine } from 'src/entity/predefine.entity';
import { Repository } from 'typeorm';
import { PredefineDto } from './dto/predefine.dto';

@Injectable()
export class PredefineService {
  constructor(
    @InjectRepository(Predefine)
    private predefineRepository: Repository<Predefine>,
    private commonService: CommonService,
  ) {}

  // async paginate(options: IPaginationOptions): Promise<Pagination<Predefine>>{}

  async findAll(page: number, limit: number, order: 'ASC' | 'DESC' = 'ASC') {
    limit = limit > 100 ? 100 : limit;

    // console.log(page, limit);

    const [items, totalItems]: [Predefine[], number] =
      await this.predefineRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: {
          createDate: order,
        },
      });

    const totalPages = Math.ceil(totalItems / limit);
    const itemCount = items.length;
    // console.log(totalPages);
    // console.log(itemCount);

    return {
      items,
      meta: {
        itemCount,
        totalItems,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  getByID(predefineGroup: string, predefineCD: string): Promise<Predefine> {
    return this.predefineRepository.findOneBy({
      predefineGroup,
      predefineCD,
    });
  }

  // async search(dto: PredefineSearchDto) {
  async search(dto: PredefineDto) {
    try {
      const req = await this.commonService.getConnection();
      req.input('Predefine_Group', dto.predefineGroup);
      req.input('Predefine_CD', dto.predefineCD);
      req.input('Value_TH', dto.valueTH);
      req.input('Value_EN', dto.valueEN);
      req.input('Is_Active', dto.isActive);
      req.input('Language', 'EN');
      req.input('Row_No_From', dto.searchOptions.rowFrom);
      req.input('Row_No_To', dto.searchOptions.rowTo);

      // console.log('req.input', req.input);

      const query = await this.commonService.executeStoreProcedure(
        'sp_co_Search_Predefine',
        req,
      );

      let result;

      if (query.recordsets[0].length > 0) {
        result = {
          data: query.recordsets[0],
          totalRecord: query.recordsets[1][0].Total_Record,
        };
      } else {
        result = {
          data: [],
          totalRecord: 0,
        };
      }

      return result;
    } catch (error) {
      console.log(error);
      // this.logger.error(error);
      throw error;
    }
  }

  async addPredefine(data: Predefine): Promise<Predefine | object> {
    const predefine = await this.predefineRepository.findBy({
      predefineGroup: data.predefineGroup,
      predefineCD: data.predefineCD,
    });

    if (predefine.length != 0) {
      return { message: 'data is already is exist' };
    }

    data.createDate = new Date();
    data.updateDate = new Date();
    return this.predefineRepository.save(data);
  }

  async updatePredefine(data: Predefine): Promise<boolean> {
    const r = await this.predefineRepository.update(
      {
        predefineGroup: data.predefineGroup,
        predefineCD: data.predefineCD,
      },
      {
        description: data.description,
        valueTH: data.valueTH,
        valueEN: data.valueEN,
        isActive: data.isActive,
        updateDate: new Date(),
      },
    );

    return r.affected > 0;
  }

  async deletePredefine(
    predefineGroup: string,
    predefineCD: string,
  ): Promise<boolean> {
    const r = await this.predefineRepository.delete({
      predefineGroup: predefineGroup,
      predefineCD: predefineCD,
    });
    return r.affected > 0;
  }

  // =====================================
  async create(data: PredefineDto) {
    // console.log('predefine create');
    try {
      const predefine = await this.predefineRepository.findBy({
        predefineGroup: data.predefineGroup,
        predefineCD: data.predefineCD,
      });

      if (predefine.length != 0) {
        return { message: 'data is already is exist' };
      }

      data.createDate = new Date();
      const result = this.predefineRepository.save(data);
      return result;
    } catch (error) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  async update(data: PredefineDto) {
    try {
      const result = await this.predefineRepository.update(
        {
          predefineGroup: data.predefineGroup,
          predefineCD: data.predefineCD,
        },
        {
          description: data.description,
          valueTH: data.valueTH,
          valueEN: data.valueEN,
          isActive: data.isActive,
          createBy: data.createBy,
          updateBy: data.updateBy,
          updateDate: new Date(),
        },
      );
      return result;
    } catch (error) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  async delete(data: PredefineDto) {
    try {
      const result = await this.predefineRepository.delete({
        predefineGroup: data.predefineGroup,
        predefineCD: data.predefineCD,
      });
      return result.affected > 0;
    } catch (error) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  async findByGroup(group: string): Promise<Predefine[]> {
    try {
      const queryBuilder = this.predefineRepository
        .createQueryBuilder('Predefine')
        .select('predefine_group')
        .addSelect('predefine_cd', 'value')
        .where('predefine_group = :group', { group })
        .andWhere('is_active = :isActive', { isActive: 'Y' });
      const result = queryBuilder.getRawMany();
      return result;
    } catch (error) {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}

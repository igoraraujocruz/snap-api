import { getRepository, Repository } from 'typeorm';
import { IClientsRepository } from '@modules/clients/repositories/IClientsRepository';
import BaseRepository from '@shared/infra/typeorm/repositories/BaseRepository';
import { Client } from '@modules/clients/infra/typeorm/entities/Client';
import { AppError } from '@shared/errors/AppError';

export class ClientsRepository
    extends BaseRepository<Client>
    implements IClientsRepository
{
    readonly ormRepository: Repository<Client>;

    constructor() {
        const repo = getRepository(Client);
        super(repo);
        this.ormRepository = repo;
    }

    public async findByUsername(username: string): Promise<Client | undefined> {
        const item = this.ormRepository.findOne({
            where: { username },
        });

        return item;
    }

    public async findByEmail(email: string): Promise<Client | undefined> {
        const item = this.ormRepository.findOne({
            where: { email },
        });

        return item;
    }

    public async findByMobilePhone(
        mobilePhone: string,
    ): Promise<Client | undefined> {
        const item = this.ormRepository.findOne({
            where: { mobilePhone },
        });

        return item;
    }

    public async findByCpf(cpf: string): Promise<Client | undefined> {
        const item = this.ormRepository.findOne({
            where: { cpf },
        });

        return item;
    }

    async addPoints({id, points}: Pick<Client, 'id' | 'points'>): Promise<void> {

        const client = await this.findById(id)

        if (!client) {
            throw new AppError('Client não encontrado.', 401);
        }
        
        client.points += points

        await this.save(client)

    }

    async decreasePoints({id, points}: Pick<Client, 'id' | 'points'>): Promise<void> {

        const client = await this.findById(id)

        if (!client) {
            throw new AppError('Client não encontrado.', 401);
        }
        
        client.points -= points

        await this.save(client)

    }

    async findAllByName(name: string): Promise<Client[]> {
        const item = this.ormRepository
        .createQueryBuilder('client')
        .leftJoinAndSelect('client.shop', 'shop')
        .where('LOWER(client.name) = LOWER(:name)', { name })
        .getMany();

        return item;
    }
}

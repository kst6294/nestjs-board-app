import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/auth/account.entity';
import { GetAccount } from 'src/auth/get-account.decorator';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { BoardsService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardsController');
  constructor(private boardsService: BoardsService) {}

  @Get()
  getAllBoards(@GetAccount() account: Account): Promise<Board[]> {
    this.logger.verbose(`Account ${account.username} trying to get all boards`);
    return this.boardsService.getAllBoards(account);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetAccount() account: Account,
  ): Promise<Board> {
    this.logger.verbose(`Account ${account.username} creating a new board.`);
    return this.boardsService.createBoard(createBoardDto, account);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }

  @Delete('/:id')
  deleteBoard(
    @Param('id', ParseIntPipe) id,
    @GetAccount() account: Account,
  ): Promise<void> {
    return this.boardsService.deleteBoard(id, account);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return this.boardsService.updateBoardStatus(id, status);
  }
}

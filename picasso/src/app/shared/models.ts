import * as moment from 'moment';

export type ViewType = 'list' | 'table';
export type FilterStateType = {status: boolean, value: number};

export enum Networks {
  Binance = 'bsc',
  Polygon = 'matic',
  Ethereum = 'ethereum',
  Solana = 'solana'
}

export enum PlatformIcons {
  Picasso = '/assets/images/picasso-logo.png',
  GameFi = 'https://hub.gamefi.org/images/partnerships/gamefi.png',
  RedKite = 'https://redkite.polkafoundry.com/images/landing/logo.svg',
  PoolzFinance = 'https://poolz.finance/static/media/new-logo.667bf972.svg',
  SeedifyFund = 'https://s2.coinmarketcap.com/static/img/coins/200x200/8972.png',
  TrustPad = 'https://img.api.cryptorank.io/ido-platforms/trust_pad1629276525425.png',
  NFTPad = 'https://pbs.twimg.com/profile_images/1426210044358582277/fwAYeYrn_400x400.jpg',
  LZ = 'https://raw.githubusercontent.com/ezDeFi/ezdefi-media/master/launchzone-logo/lz-logo.png',
  KrystalGo = 'https://go.krystal.app/static/media/krystal.e6667918.svg',
  BscStation = 'https://bscstation.finance/images/logo-default.png',
  BscLaunch = 'https://app.bsclaunch.org/img/logo-with-name.dark.f0b3ddcf.svg',
  Truepnl = 'https://s2.coinmarketcap.com/static/img/coins/200x200/9605.png'
}

export enum Platforms {
  GameFi = 'gamefi',
  RedKite = 'redkite',
  PoolzFinance = 'poolzfinance',
  SeedifyFund = 'seedifyfund',
  TrustPad = 'trustpad',
  NFTPad = 'nftpad',
  LZ = 'lz',
  KrystalGo = 'krystalgo',
  BscStation = 'bscstation',
  BscLaunch = 'bsclaunch',
  Truepnl = 'truepnl'
}

export interface Token{
  logoUrl: string;
  symbol: string;
  name: string;
  balance: number;
  pricePercentage24h: number;
  pricePercentage7d: number;
  sum: number;
  currentPrice: number;
  contractAddress: string;
  transactions?: Transaction[];
}

export interface Wallet{
  name: string;
  address: string;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  date: Date;
  status: string;
  type: string;
  description: string;
}

export interface CalendarDate {
  mDate: moment.Moment;
  isNotCurrentMonth: boolean;
  isWeekend: boolean;
  today?: boolean;
  dayName?: string;
  dateString: string;
  events: Event[],
  otherPools: { [key: string]: PoolData[] }
}

export interface MetadataEvent {
  title: string;
  value: string;
}

export interface Event {
  id?: string | number;
  title: string;
  tokenName: string;
  link: string;
  metadata: MetadataEvent[];
  date: string,
  icon: PlatformIcons,
  banner: string;
}

export interface PoolData {
  acceptCurrency: string;
  banner: string;
  displayTime: Date;
  calendarDateTime: Date;
  createdAt: string;
  description: string;
  network: string;
  infoTitle: string;
  symbol: string;
  title: string;
  tokenImage: string;
  projectWebsite: string;
  url: string;
  type: string;
  platformImage: PlatformIcons;
  fields: {[key: string]: string}[];
}

export interface ClaimConfig {
  id?: number;
  chain: string;
  date: Date,
  percentage: string;
  token: string;
  type: string;
  source: string;
  chainImg?: string;
  groupId: number;
}

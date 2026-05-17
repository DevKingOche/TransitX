import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as StellarSdk from '@stellar/stellar-sdk';

@Injectable()
export class StellarService {
  private readonly logger = new Logger(StellarService.name);
  private readonly server: StellarSdk.Horizon.Server;
  private readonly network: string;

  constructor(private readonly config: ConfigService) {
    this.network = this.config.get<string>('STELLAR_NETWORK', 'testnet');
    const horizonUrl =
      this.network === 'mainnet'
        ? 'https://horizon.stellar.org'
        : 'https://horizon-testnet.stellar.org';
    this.server = new StellarSdk.Horizon.Server(horizonUrl);
  }

  async getAccountBalance(stellarAddress: string): Promise<string> {
    try {
      const account = await this.server.loadAccount(stellarAddress);
      const usdcBalance = account.balances.find(
        (b: any) => b.asset_code === 'USDC',
      );
      return usdcBalance ? usdcBalance.balance : '0';
    } catch (err) {
      this.logger.warn(`Could not load account ${stellarAddress}: ${err.message}`);
      return '0';
    }
  }

  isValidStellarAddress(address: string): boolean {
    try {
      StellarSdk.Keypair.fromPublicKey(address);
      return true;
    } catch {
      return false;
    }
  }
}

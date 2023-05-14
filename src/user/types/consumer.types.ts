export type ConsumerRegisterInput = {
  username: string;
  password: string;
  phone: string;
  displayName: string;
};

export type ConsumerLoginInput = {
  username: string;
  password: string;
};

export type ConsumerBankAccountInput = {
  bank: string;
  numberBank: string;
  ownBank: string;
};

export type ConsumerBetInput = {
  totalMoney: number;
  bonus: number;
  winOrLose: string;
  typeBet: string;
  region: string;
  numberBet: string;
  rateBet: number;
};

export type ConsumerMoneyInput = {
  totalMoney: number;
  type: string;
  formalityBank: string;
  codeTransfer: string;
  note: string;
  bank: string;
};

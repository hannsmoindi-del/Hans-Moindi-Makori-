import React, { useState } from 'react';
import { useDeriv } from '../../context/DerivContext';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  CreditCard,
  Coins,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

export const CashierView: React.FC = () => {
  const {
    balances,
    deposit,
    withdraw,
    transfer,
    transactions,
    activeWallet,
    setActiveWallet,
    setAccountType,
  } = useDeriv();

  const [activeTab, setActiveTab] = useState<'deposit' | 'withdrawal' | 'transfer' | 'transactions'>('deposit');
  const [gateway, setGateway] = useState<string>('Cryptocurrency (Tether TRC20 / BTC)');
  const [amount, setAmount] = useState<string>('500.00');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
  const [transferFrom, setTransferFrom] = useState<keyof typeof balances>('usdReal');
  const [transferTo, setTransferTo] = useState<keyof typeof balances>('mt5Derived');
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setMsg({ text: 'Please enter a valid deposit amount', error: true });
      return;
    }
    const res = deposit(gateway, val);
    if (res.success) {
      setMsg({ text: `Deposit of +$${val.toFixed(2)} completed successfully via ${gateway}` });
    }
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setMsg({ text: 'Please enter a valid withdrawal amount', error: true });
      return;
    }
    const res = withdraw(gateway, val, withdrawAddress);
    if (res.success) {
      setMsg({ text: `Withdrawal of -$${val.toFixed(2)} initiated to ${withdrawAddress.slice(0, 8)}...` });
    } else {
      setMsg({ text: res.message, error: true });
    }
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setMsg({ text: 'Please enter a valid transfer amount', error: true });
      return;
    }
    const res = transfer(transferFrom, transferTo, val);
    if (res.success) {
      setMsg({ text: `Internal transfer of $${val.toFixed(2)} completed with 0% fee` });
    } else {
      setMsg({ text: res.message, error: true });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 sm:p-9 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Deriv Cashier & Multi-Wallet Hub
          </h2>
          <p className="text-xs text-[#8592a6]">
            Deposit, withdraw, and seamlessly transfer funds between your Fiat, Crypto, and MT5 accounts
          </p>
        </div>

        {/* Global Security Badge */}
        <div className="flex items-center gap-2 bg-[#1b263b] border border-[#293548] px-3.5 py-1.5 rounded-lg text-xs text-[#00c853]">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-semibold text-white">Tier 2 Verified (SSL 256-bit)</span>
        </div>
      </div>

      {/* Multi-Wallet Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* USD Real */}
        <div className="bg-[#1b263b] border border-[#293548] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#8592a6] text-xs mb-1">
            <span>USD Real Wallet</span>
            <span className="text-[10px] font-bold text-[#ff444f] bg-[#ff444f]/10 px-2 py-0.5 rounded">Fiat</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#00c853]">
            ${balances.usdReal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#8592a6] mt-1">Available for DTrader, DBot & Cashier</div>
        </div>

        {/* MT5 Derived */}
        <div className="bg-[#1b263b] border border-[#293548] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#8592a6] text-xs mb-1">
            <span>MT5 Derived Account</span>
            <span className="text-[10px] font-bold text-[#2962ff] bg-[#2962ff]/10 px-2 py-0.5 rounded">Synthetics</span>
          </div>
          <div className="text-xl font-bold font-mono text-white">
            ${balances.mt5Derived.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#8592a6] mt-1">Leverage 1:1000 · Server: SVG</div>
        </div>

        {/* BTC Crypto */}
        <div className="bg-[#1b263b] border border-[#293548] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#8592a6] text-xs mb-1">
            <span>BTC Real Wallet</span>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">Crypto</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            ₿ {balances.btcReal.toFixed(4)}
          </div>
          <div className="text-[11px] text-[#8592a6] mt-1">≈ ${(balances.btcReal * 68120).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</div>
        </div>

        {/* Demo Account */}
        <div className="bg-[#1b263b] border border-[#293548] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-[#8592a6] text-xs mb-1">
            <span>Virtual Demo</span>
            <span className="text-[10px] font-bold text-[#8592a6] bg-[#0e1726] px-2 py-0.5 rounded">Practice</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#2962ff]">
            ${balances.usdDemo.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-[#8592a6] mt-1">Unlimited reloadable test balance</div>
        </div>
      </div>

      {/* Cashier Operation Tabs */}
      <div className="bg-[#1b263b] border border-[#293548] rounded-xl p-6 shadow-md">
        <div className="flex flex-wrap gap-2.5 border-b border-[#293548] pb-4 mb-6">
          {(['deposit', 'withdrawal', 'transfer', 'transactions'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setMsg(null);
              }}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#ff444f] text-white shadow-md shadow-[#ff444f]/20'
                  : 'bg-[#0e1726] border border-[#293548] text-[#8592a6] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {msg && (
          <div
            className={`p-3.5 mb-5 rounded-lg text-xs flex items-center gap-2 ${
              msg.error
                ? 'bg-[#ff444f]/15 border border-[#ff444f]/30 text-[#ff444f]'
                : 'bg-[#00c853]/15 border border-[#00c853]/30 text-[#00c853]'
            }`}
          >
            {msg.error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Tab 1: Deposit */}
        {activeTab === 'deposit' && (
          <form onSubmit={handleDeposit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white">Payment Method / Gateway</label>
                <select
                  value={gateway}
                  onChange={e => setGateway(e.target.value)}
                  className="bg-[#0e1726] border border-[#293548] text-white p-3 rounded-lg text-sm focus:outline-none focus:border-[#ff444f]"
                >
                  <option>Credit / Debit Card (Visa/Mastercard)</option>
                  <option>Cryptocurrency (Tether TRC20 / BTC)</option>
                  <option>E-Wallet (Sticpay / Skrill / Neteller)</option>
                  <option>Deriv Peer-to-Peer (P2P)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white">Deposit Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-[#8592a6] text-sm font-mono">$</span>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-[#0e1726] border border-[#293548] text-white pl-8 pr-4 py-3 rounded-lg text-sm font-mono focus:outline-none focus:border-[#ff444f]"
                  />
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[100, 250, 500, 1000].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val.toFixed(2))}
                    className="py-2 bg-[#0e1726] hover:bg-[#293548] border border-[#293548] rounded text-xs font-mono text-white transition-colors cursor-pointer"
                  >
                    +${val}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff444f] hover:bg-[#ff444f]/90 text-white font-bold py-3.5 rounded-lg text-sm transition-all cursor-pointer shadow-md shadow-[#ff444f]/25"
              >
                Proceed with Instant Deposit
              </button>
            </div>

            {/* Gateway Info Box */}
            <div className="bg-[#0e1726] border border-[#293548] rounded-xl p-5 flex flex-col justify-between text-xs text-[#8592a6]">
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white">Gateway Details & Policy</h4>
                <div className="flex justify-between py-1 border-b border-[#293548]">
                  <span>Processing Time:</span>
                  <span className="text-[#00c853] font-semibold">Instant (0-2 mins)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#293548]">
                  <span>Deriv Processing Fee:</span>
                  <span className="text-white font-semibold">0% Free</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#293548]">
                  <span>Min / Max Limits:</span>
                  <span className="text-white font-mono">$10.00 / $50,000.00</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Target Wallet:</span>
                  <span className="text-white font-semibold">USD Real Wallet (CR984210)</span>
                </div>
              </div>

              <div className="p-3 bg-[#1b263b] rounded-lg border border-[#293548] mt-4 flex items-center gap-2 text-[11px] text-white">
                <ShieldCheck className="w-4 h-4 text-[#00c853] shrink-0" />
                <span>All transactions protected by PCI-DSS Level 1 compliance and 256-bit encryption.</span>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Withdrawal */}
        {activeTab === 'withdrawal' && (
          <form onSubmit={handleWithdrawal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white">Withdrawal Method</label>
                <select
                  value={gateway}
                  onChange={e => setGateway(e.target.value)}
                  className="bg-[#0e1726] border border-[#293548] text-white p-3 rounded-lg text-sm focus:outline-none focus:border-[#ff444f]"
                >
                  <option>Cryptocurrency (Tether TRC20 / BTC)</option>
                  <option>Bank Wire Transfer</option>
                  <option>Credit / Debit Card (Visa/Mastercard)</option>
                  <option>E-Wallet (Skrill / Neteller)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white">Recipient Wallet / Bank Account</label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={e => setWithdrawAddress(e.target.value)}
                  className="bg-[#0e1726] border border-[#293548] text-white p-3 rounded-lg text-xs font-mono focus:outline-none focus:border-[#ff444f]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-white">Amount (USD)</label>
                  <span className="text-[#8592a6] font-mono">
                    Max: ${balances.usdReal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-[#8592a6] text-sm font-mono">$</span>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-[#0e1726] border border-[#293548] text-white pl-8 pr-4 py-3 rounded-lg text-sm font-mono focus:outline-none focus:border-[#ff444f]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff444f] hover:bg-[#ff444f]/90 text-white font-bold py-3.5 rounded-lg text-sm transition-all cursor-pointer shadow-md shadow-[#ff444f]/25"
              >
                Request Withdrawal
              </button>
            </div>

            <div className="bg-[#0e1726] border border-[#293548] rounded-xl p-5 flex flex-col justify-between text-xs text-[#8592a6]">
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-bold text-white">Withdrawal Security Rules</h4>
                <div className="flex justify-between py-1 border-b border-[#293548]">
                  <span>Estimated Processing:</span>
                  <span className="text-white font-semibold">1-24 Hours</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#293548]">
                  <span>Deriv Withdrawal Fee:</span>
                  <span className="text-[#00c853] font-semibold">0% Free</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#293548]">
                  <span>Daily Limit Remaining:</span>
                  <span className="text-white font-mono">$100,000.00</span>
                </div>
              </div>

              <div className="p-3 bg-[#1b263b] rounded-lg border border-[#293548] mt-4 text-[11px] text-[#8592a6]">
                Withdrawals are automatically sent to the verified payment method used for funding to prevent fraud and comply with AML regulations.
              </div>
            </div>
          </form>
        )}

        {/* Tab 3: Internal Transfer */}
        {activeTab === 'transfer' && (
          <form onSubmit={handleTransfer} className="max-w-xl flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white">From Account</label>
                <select
                  value={transferFrom}
                  onChange={e => setTransferFrom(e.target.value as any)}
                  className="bg-[#0e1726] border border-[#293548] text-white p-3 rounded-lg text-xs"
                >
                  <option value="usdReal">USD Real Wallet (${balances.usdReal.toLocaleString()})</option>
                  <option value="mt5Derived">MT5 Derived (${balances.mt5Derived.toLocaleString()})</option>
                  <option value="mt5Financial">MT5 Financial (${balances.mt5Financial.toLocaleString()})</option>
                  <option value="btcReal">BTC Wallet (₿{balances.btcReal.toFixed(4)})</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white">To Account</label>
                <select
                  value={transferTo}
                  onChange={e => setTransferTo(e.target.value as any)}
                  className="bg-[#0e1726] border border-[#293548] text-white p-3 rounded-lg text-xs"
                >
                  <option value="mt5Derived">MT5 Derived (${balances.mt5Derived.toLocaleString()})</option>
                  <option value="mt5Financial">MT5 Financial (${balances.mt5Financial.toLocaleString()})</option>
                  <option value="usdReal">USD Real Wallet (${balances.usdReal.toLocaleString()})</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-white">Amount (USD)</label>
              <input
                type="number"
                step="any"
                min="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="bg-[#0e1726] border border-[#293548] text-white p-3 rounded-lg text-sm font-mono focus:outline-none focus:border-[#ff444f]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#ff444f] hover:bg-[#ff444f]/90 text-white font-bold py-3.5 rounded-lg text-sm transition-all cursor-pointer shadow-md shadow-[#ff444f]/25"
            >
              Transfer Funds Instantly (0% Fee)
            </button>
          </form>
        )}

        {/* Tab 4: Transactions Ledger */}
        {activeTab === 'transactions' && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#293548] text-[#8592a6] font-sans">
                  <th className="py-3 px-3">Transaction ID</th>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Gateway / Destination</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#293548]">
                {transactions.map(txn => {
                  const isPositive = txn.amount >= 0;
                  return (
                    <tr key={txn.id} className="hover:bg-[#0e1726]/50">
                      <td className="py-3 px-3 text-white font-bold">{txn.id}</td>
                      <td className="py-3 px-3 text-[#8592a6] font-sans">{txn.timestamp}</td>
                      <td className="py-3 px-3 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          txn.type === 'Deposit'
                            ? 'bg-[#00c853]/15 text-[#00c853]'
                            : txn.type === 'Withdrawal'
                            ? 'bg-[#ff444f]/15 text-[#ff444f]'
                            : 'bg-[#2962ff]/15 text-[#2962ff]'
                        }`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans text-white">{txn.gateway}</td>
                      <td className={`py-3 px-3 font-bold ${isPositive ? 'text-[#00c853]' : 'text-[#ff444f]'}`}>
                        {isPositive ? '+' : '-'}${Math.abs(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span className="text-[#00c853] font-bold">
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

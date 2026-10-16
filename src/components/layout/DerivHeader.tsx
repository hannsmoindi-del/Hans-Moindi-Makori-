import React, { useState } from 'react';
import { useDeriv } from '../../context/DerivContext';
import {
  Menu,
  ChevronDown,
  PlusCircle,
  Bell,
  X,
  Wallet,
  Zap,
  TrendingUp,
  TrendingDown,
  Check
} from 'lucide-react';

interface DerivHeaderProps {
  onOpenMobileMenu: () => void;
  onOpenCashierDeposit: () => void;
  onOpenCommandPalette?: () => void;
  onOpenShortcuts?: () => void;
}

export const DerivHeader: React.FC<DerivHeaderProps> = ({
  onOpenMobileMenu,
  onOpenCashierDeposit,
  onOpenCommandPalette,
  onOpenShortcuts,
}) => {
  const {
    accountType,
    setAccountType,
    balances,
    activeWallet,
    setActiveWallet,
    selectedAsset,
    notification,
    clearNotification,
  } = useDeriv();

  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);

  const isReal = accountType === 'real';
  const displayBalance = isReal
    ? (activeWallet === 'usd' ? balances.usdReal : activeWallet === 'btc' ? balances.btcReal : balances.usdtReal)
    : balances.usdDemo;

  return (
    <header className="relative h-[75px] border-b border-[#293548] bg-[#111927] flex items-center justify-between px-6 sm:px-9 z-30 shrink-0">
      {/* Left: Mobile hamburger & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 text-[#8592a6] hover:text-white md:hidden rounded-lg hover:bg-[#1b263b] cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Welcome Back, Trader
          </h2>
          <div className="flex items-center gap-2 text-xs text-[#8592a6]">
            <span className="hidden sm:inline font-mono">Deriv Trader's Hub</span>
            <span className="hidden sm:inline text-[#293548]">•</span>
            <span className="flex items-center gap-1 font-mono text-[11px] text-white">
              {selectedAsset.name}: ${selectedAsset.price.toLocaleString(undefined, { minimumFractionDigits: selectedAsset.decimals })}
              <span className={selectedAsset.change24h >= 0 ? 'text-[#00c853]' : 'text-[#ff444f]'}>
                ({selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h}%)
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Account Switcher, Wallet Pill & Cashier */}
      <div className="flex items-center gap-3">
        {/* Real / Demo Pill Toggle */}
        <div className="hidden sm:flex bg-[#0e1726] p-1 rounded-full border border-[#293548] text-xs font-semibold">
          <button
            onClick={() => setAccountType('real')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              isReal
                ? 'bg-[#ff444f] text-white shadow-sm'
                : 'text-[#8592a6] hover:text-white'
            }`}
          >
            Real
          </button>
          <button
            onClick={() => setAccountType('demo')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              !isReal
                ? 'bg-[#2962ff] text-white shadow-sm'
                : 'text-[#8592a6] hover:text-white'
            }`}
          >
            Demo
          </button>
        </div>

        {/* Wallet Pill matching HTML specifications: .wallet-pill */}
        <div className="relative">
          <button
            onClick={() => setWalletDropdownOpen(prev => !prev)}
            className="bg-[#1b263b] border border-[#293548] hover:border-[#ff444f]/50 px-4 py-2 rounded-full flex items-center gap-3 text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
          >
            <span className="text-[#8592a6] hidden sm:inline">
              {isReal ? (activeWallet === 'usd' ? 'USD Real Wallet:' : activeWallet === 'btc' ? 'BTC Real Wallet:' : 'USDT Real Wallet:') : 'Demo Account:'}
            </span>
            <span className="text-[#00c853] font-bold font-mono">
              {isReal && activeWallet === 'btc'
                ? `₿ ${displayBalance.toFixed(4)}`
                : `$${displayBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8592a6]" />
          </button>

          {/* Wallet Dropdown Popover */}
          {walletDropdownOpen && (
            <div className="absolute right-0 top-12 w-64 bg-[#1b263b] border border-[#293548] rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="p-2 border-b border-[#293548] text-[#8592a6] font-semibold text-[11px] uppercase tracking-wider">
                Select Active Wallet
              </div>
              <div className="flex flex-col gap-1 py-1">
                <button
                  onClick={() => {
                    setAccountType('real');
                    setActiveWallet('usd');
                    setWalletDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#0e1726] text-left transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-white">USD Real Wallet</div>
                    <div className="text-[11px] text-[#8592a6]">Primary Fiat Wallet</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#00c853] font-mono font-bold">
                      ${balances.usdReal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    {isReal && activeWallet === 'usd' && (
                      <span className="text-[10px] text-[#ff444f] font-semibold flex items-center justify-end gap-0.5">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAccountType('real');
                    setActiveWallet('btc');
                    setWalletDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#0e1726] text-left transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-white">BTC Crypto Wallet</div>
                    <div className="text-[11px] text-[#8592a6]">Bitcoin On-chain</div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-mono font-bold">
                      ₿ {balances.btcReal.toFixed(4)}
                    </div>
                    {isReal && activeWallet === 'btc' && (
                      <span className="text-[10px] text-[#ff444f] font-semibold flex items-center justify-end gap-0.5">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAccountType('demo');
                    setWalletDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#0e1726] text-left transition-colors cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-white">Virtual Demo Account</div>
                    <div className="text-[11px] text-[#8592a6]">Practice Trading</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#2962ff] font-mono font-bold">
                      ${balances.usdDemo.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    {!isReal && (
                      <span className="text-[10px] text-[#2962ff] font-semibold flex items-center justify-end gap-0.5">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                </button>
              </div>

              <div className="pt-2 border-t border-[#293548] flex justify-between items-center px-2 py-1">
                <span className="text-[11px] text-[#8592a6]">MT5 Derived:</span>
                <span className="text-white font-mono font-bold text-[11px]">
                  ${balances.mt5Derived.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Deposit Quick Action */}
        <button
          onClick={onOpenCashierDeposit}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#ff444f] hover:bg-[#ff444f]/90 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm shadow-[#ff444f]/20"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Deposit</span>
        </button>
      </div>

      {/* Floating Notification Banner */}
      {notification && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-20 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl border text-xs font-medium animate-in fade-in duration-200 max-w-lg ${
            notification.type === 'success'
              ? 'bg-[#1b263b] border-[#00c853] text-[#00c853]'
              : notification.type === 'error'
              ? 'bg-[#1b263b] border-[#ff444f] text-[#ff444f]'
              : 'bg-[#1b263b] border-[#2962ff] text-white'
          }`}
        >
          <Bell className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-white">{notification.message}</span>
          <button
            onClick={clearNotification}
            className="p-1 text-[#8592a6] hover:text-white rounded ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </header>
  );
};

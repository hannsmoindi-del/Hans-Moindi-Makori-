import React, { useState } from 'react';
import { useDeriv } from '../../context/DerivContext';
import { X, PlusCircle, ShieldCheck, CreditCard } from 'lucide-react';

interface QuickDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickDepositModal: React.FC<QuickDepositModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { deposit } = useDeriv();
  const [gateway, setGateway] = useState('Credit / Debit Card (Visa/Mastercard)');
  const [amount, setAmount] = useState('500.00');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val && val > 0) {
      deposit(gateway, val);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#1b263b] border border-[#293548] rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#8592a6] hover:text-white p-1 rounded-lg hover:bg-[#0e1726] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#ff444f]/20 text-[#ff444f] flex items-center justify-center border border-[#ff444f]/30">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Deposit to USD Real Wallet</h3>
            <p className="text-xs text-[#8592a6]">Instant zero-fee wallet funding</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white">Payment Method</label>
            <select
              value={gateway}
              onChange={e => setGateway(e.target.value)}
              className="bg-[#0e1726] border border-[#293548] text-white p-3 rounded-lg text-xs"
            >
              <option>Credit / Debit Card (Visa/Mastercard)</option>
              <option>Cryptocurrency (Tether TRC20 / BTC)</option>
              <option>E-Wallet (Sticpay / Skrill / Neteller)</option>
              <option>Deriv Peer-to-Peer (P2P)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white">Quick Select</label>
            <div className="grid grid-cols-4 gap-2">
              {[100, 500, 1000, 5000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toFixed(2))}
                  className={`py-2 text-xs font-mono font-bold rounded-lg border transition-colors cursor-pointer ${
                    amount === val.toFixed(2)
                      ? 'bg-[#ff444f] text-white border-[#ff444f]'
                      : 'bg-[#0e1726] text-[#8592a6] border-[#293548] hover:text-white'
                  }`}
                >
                  +${val}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-white">Amount (USD)</label>
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

          <div className="p-3 bg-[#0e1726] rounded-xl border border-[#293548] text-[11px] text-[#8592a6] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00c853] shrink-0" />
            <span>Instant credit to USD Real Wallet (CR984210) with 0% deposit commission.</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#293548]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#8592a6] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold bg-[#ff444f] hover:bg-[#ff444f]/90 text-white rounded-lg transition-colors cursor-pointer shadow-md shadow-[#ff444f]/25"
            >
              Confirm Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

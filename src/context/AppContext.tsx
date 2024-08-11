import { createContext, useContext, useEffect, useState } from 'react';
import { Schema } from '../validations/schema';
import { Transaction } from '../types';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { isFirestoreError } from '../utils/errorHandling';

interface AppContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppcontextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Transactions'));
        const transactionsData = querySnapshot.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction;
        });

        setTransactions(transactionsData);
      } catch (err) {
        if (isFirestoreError(err)) {
          console.error('firebaseのエラー', err.code);
          console.error('firebaseのエラー', err.message);
        } else {
          console.error('一般的なエラー', err);
        }
      } finally {
      }
    };

    fetchTransactions();
  }, []);

  const onSaveTransaction = async (transaction: Schema) => {
    try {
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, 'Transactions'), transaction);
      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        newTransaction,
      ]);
    } catch (err) {
      if (isFirestoreError(err)) {
        console.error('firestoreのエラーは', err.message);
      } else {
        console.error('一般的なエラー', err);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        currentMonth,
        setCurrentMonth,
        onSaveTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('グローバルなデータはプロバイダーの中で取得してください。');
  }
  return context;
};

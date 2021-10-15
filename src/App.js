import "./App.css";
import { Container } from "semantic-ui-react";
import MainHeader from "./components/MainHeader";
import DisplayBalance from "./components/DisplayBalance";
import NewEntryForm from "./components/NewEntryForm";
import DisplayBalances from "./components/DisplayBalances";
import EntryLines from "./components/EntryLines";
import { useEffect, useState } from "react";
import ModalEdit from "./components/ModalEdit";
import { useDispatch, useSelector } from "react-redux";
import { getAllEntries } from './actions/entries.actions';
import axios from 'axios';

function App() {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState();
  const [total, setTotal] = useState(0);
  const [entry, setEntry] = useState({});
  const { isOpen, id } = useSelector((state) => state.modals);
  const entries = useSelector((state) => state.entries);

  useEffect(() => {
    const index = entries.findIndex(entry => entry.id === id);
    setEntry(entries[index]);
  }, [isOpen, id, entries]);

  useEffect(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    entries.map((entry) => {
      if (entry.isExpense) {
        return (totalExpense += Number(entry.value));
      }
      return (totalIncome += Number(entry.value));
    });
    setTotal(totalIncome - totalExpense);
    setExpenseTotal(totalExpense);
    setIncomeTotal(totalIncome);
  }, [entries]);

  async function fetchInitialData() {
    const result = await axios.get('http://localhost:3001/entries');
    console.log(result);
  }
  useEffect(()=>{
    fetchInitialData();
  },[]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllEntries());
  }, [dispatch]);

  return (
    <Container>
      <MainHeader title="Budget" />

      <DisplayBalance title="Your Balance:" value={total} size="small" />

      <DisplayBalances incomeTotal={incomeTotal} expenseTotal={expenseTotal} />

      <MainHeader title="History" type="h3" />

      <EntryLines entries={entries} />

      <MainHeader title="Add New Transaction" type="h3" />
      <NewEntryForm 
      />
      <ModalEdit isOpen={isOpen} {...entry}/>
    </Container>
  );
}

export default App;

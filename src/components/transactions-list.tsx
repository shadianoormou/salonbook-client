'use client';
import { useState } from 'react';
import { CreditCard,ShieldCheck } from 'lucide-react';
import { useAuth } from './auth-provider';
import { useLoad } from '@/lib/use-load';
import { List,Transaction,dateLabel,money } from '@/lib/types';
import { Loading,Badge,Empty,Pagination } from './loading';
import { ErrorState } from './error-state';
export function TransactionsList(){
  const {user}=useAuth(),admin=user?.role==='admin',[page,setPage]=useState(1);
  const {data,loading,error,reload}=useLoad<List<Transaction>>(`/transactions?page=${page}&limit=10`);
  return <><div className="dashboard-title"><div><span className="eyebrow">A clear record of every payment</span><h1>{admin?'Transactions':'Payment history'}</h1><p>{admin?'Securely verified payments, all in one place.':'Your salon moments, neatly taken care of.'}</p></div><span className="count-label"><CreditCard size={16}/>{data?.total||0} transactions</span></div><div className="notice payment-notice"><ShieldCheck size={18}/><span>Payment records reflect verified Stripe events.</span></div>{loading?<Loading label="Finding your payment history…"/>:error?<ErrorState message={error} retry={reload}/>:!data?.data.length?<Empty title="All quiet here for now" description={admin?'Verified customer payments will appear here.':'Once you pay for a confirmed appointment, you’ll find the details here.'}/>:<><div className="table-wrap"><table className="data-table"><thead><tr>{admin&&<th>Customer</th>}<th>Service</th><th>Appointment</th><th>Amount</th><th>Currency</th><th>Stripe reference</th><th>Status</th><th>Transaction date</th></tr></thead><tbody>{data.data.map(t=><tr key={t._id}>{admin&&<td><strong>{t.customer?.name||'Customer'}</strong><small>{t.customer?.email}</small></td>}<td><strong>{t.appointment?.serviceName||'Salon appointment'}</strong></td><td>{t.appointment?dateLabel(t.appointment.appointmentDate):'—'}</td><td className="amount-cell">{money(t.amount,t.currency)}</td><td>{t.currency.toUpperCase()}</td><td><code title={t.stripeSessionId}>…{t.stripeSessionId.slice(-12)}</code></td><td><Badge value={t.status}/></td><td>{dateLabel(t.createdAt)}</td></tr>)}</tbody></table></div><Pagination page={data.page} pages={data.pages} onChange={setPage}/></>}</>;
}

'use client';
import Link from 'next/link';
import { useAuth } from './auth-provider';
import { useLoad } from '@/lib/use-load';
import { Appointment,dateLabel,money,timeLabel } from '@/lib/types';
import { Loading,Badge } from './loading';
import { ErrorState } from './error-state';
import { AppointmentActions } from './appointment-actions';
export function AppointmentDetail({id}:{id:string}){
  const {user}=useAuth(),{data,loading,error,reload}=useLoad<{data:Appointment}>(`/appointments/${id}`);
  if(loading)return <Loading label="Opening your appointment…"/>;
  if(error||!data)return <ErrorState message={error||'Appointment not found.'} retry={reload}/>;
  const a=data.data;
  return <><Link className="back-link" href={`/dashboard/${user?.role}/appointments`}>Back to appointments</Link><div className="dashboard-title"><div><span className="eyebrow">Your visit, in detail</span><h1>{a.service?.serviceName||a.serviceName}</h1><p>Requested on {dateLabel(a.createdAt)}</p></div><AppointmentActions appointment={a} admin={user?.role==='admin'} onChange={reload}/></div><div className="appointment-detail-grid"><div className="panel appointment-detail-card">{a.service?.image&&<img className="appointment-hero" src={a.service.image} alt={a.serviceName}/>}<div className="detail-facts"><div><span>Appointment date</span><strong>{dateLabel(a.appointmentDate)}</strong></div><div><span>Appointment time</span><strong>{timeLabel(a.timeSlot)}</strong></div><div><span>Service category</span><strong>{a.service?.category||'Salon service'}</strong></div><div><span>Service total</span><strong>{money(a.servicePrice,a.currency)}</strong></div><div><span>Appointment status</span><Badge value={a.status}/></div><div><span>Payment status</span><Badge value={a.paymentStatus}/></div></div></div><aside><div className="panel detail-note"><h2>{user?.role==='admin'?'Customer details':'Your details'}</h2><strong>{a.customer?.name||user?.name}</strong><p>{a.customer?.email||user?.email}</p><h3>A note for the salon</h3><p>{a.message||'No additional message.'}</p></div><div className="notice"><strong>{a.status==='pending'?'We’re reviewing your request.':a.status==='confirmed'?'Your moment is confirmed.':'This appointment has been cancelled.'}</strong><p>{a.status==='pending'?'Once confirmed, secure payment becomes available here.':a.paymentStatus==='paid'?'Your payment has been verified. You can view it in payment history.':a.status==='confirmed'?'You can now pay securely through Stripe.':'You can browse our services to request a new appointment.'}</p></div></aside></div></>;
}

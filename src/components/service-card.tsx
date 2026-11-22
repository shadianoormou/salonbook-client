import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Service,money } from '@/lib/types';
export function ServiceCard({service}:{service:Service}){return <article className="service-card"><Link href={`/services/${service._id}`} tabIndex={-1} aria-hidden="true" className="service-image"><img src={service.image} alt="" loading="lazy"/><span className="image-tag">{service.category}</span></Link><div className="service-body"><div className="service-title"><h3><Link href={`/services/${service._id}`}>{service.serviceName}</Link></h3><strong>{money(service.price)}</strong></div><p>{service.description}</p><div className="service-meta"><span><Clock size={14}/>{service.duration} min</span><Link href={`/services/${service._id}`}>View details</Link></div></div></article>;}

export default function Footer() {
  return (
    <footer className="bg-on-surface text-surface py-20 px-6 mt-12">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <span className="text-4xl font-black italic tracking-tighter text-primary-container mb-6 block font-headline">KINETIC</span>
          <p className="text-surface/60 max-w-sm leading-relaxed">
            The definitive directory for elite fitness culture in Canada. Built for those who move.
          </p>
        </div>
        
        <div>
          <h5 className="font-headline font-bold tracking-widest uppercase text-xs text-primary-container mb-6">REGIONS</h5>
          <ul className="space-y-3 font-medium text-sm text-surface/80">
            <li><a className="hover:text-primary-container transition-colors" href="#">Ontario</a></li>
            <li><a className="hover:text-primary-container transition-colors" href="#">British Columbia</a></li>
            <li><a className="hover:text-primary-container transition-colors" href="#">Quebec</a></li>
            <li><a className="hover:text-primary-container transition-colors" href="#">Alberta</a></li>
          </ul>
        </div>

        <div>
          <h5 className="font-headline font-bold tracking-widest uppercase text-xs text-primary-container mb-6">CONNECT</h5>
          <ul className="space-y-3 font-medium text-sm text-surface/80">
            <li><a className="hover:text-primary-container transition-colors" href="#">Instagram</a></li>
            <li><a className="hover:text-primary-container transition-colors" href="#">Twitter</a></li>
            <li><a className="hover:text-primary-container transition-colors" href="#">LinkedIn</a></li>
            <li><a className="hover:text-primary-container transition-colors" href="#">Contact Support</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between text-[10px] font-headline tracking-widest text-surface/40 uppercase">
        <span>© 2024 CANFIT CONNECT / KINETIC SYSTEMS INC.</span>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

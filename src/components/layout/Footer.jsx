function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500 md:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-semibold text-slate-900">
          Ledgerly
        </p>

        <p className="mt-1">
          Simple expense tracking for small businesses.
        </p>

        <p className="mt-1">
          Record expenses, organize spending, and understand where your money goes.
        </p>

        <p className="mt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} Ledgerly. Built for smarter business decisions.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
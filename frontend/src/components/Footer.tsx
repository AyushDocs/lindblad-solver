export default function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-border/50">
      <div className="max-w-4xl mx-auto text-center text-sm text-muted">
        <p className="mb-2">
          built by{" "}
          <a
            href="https://github.com/AyushDocs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-400 hover:underline"
          >
            AyushDocs
          </a>
        </p>
        <p>
          For more such interesting simulations visit{" "}
          <a
            href="https://ayushdocs.github.io/Ayush-Quantum-Adventure/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-400 hover:underline"
          >
            Quantum Adventure
          </a>
        </p>
      </div>
    </footer>
  );
}

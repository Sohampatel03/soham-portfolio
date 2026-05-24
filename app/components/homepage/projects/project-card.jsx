import { BsGithub } from 'react-icons/bs';
import { CgWebsite } from 'react-icons/cg';

function ProjectCard({ project }) {
  const hasCodeLink = Boolean(project.code);
  const hasDemoLink = Boolean(project.demo);
  const image = project.image || '/png/placeholder.png';
  const disabledButtonClass = "inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] opacity-60";

  return (
    <article className="group project-card flex h-[min(500px,calc(100vh-7rem))] flex-col overflow-hidden rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-[0_0_30px_0_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 md:h-[400px] md:flex-row">
      <div className="relative h-40 flex-none overflow-hidden border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] sm:h-48 md:h-auto md:w-[42%] md:border-b-0 md:border-r">
        <img
          src={image}
          alt={`${project.name} project preview`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/70 via-transparent to-transparent" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-[var(--bg-primary)] p-4 md:p-6">
        <p className="text-xs font-medium uppercase tracking-normal text-pink-400">
          {project.role}
        </p>

        <h3 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
          {project.name}
        </h3>

        <p className="mt-3 min-h-0 flex-1 overflow-y-auto pr-2 text-sm leading-6 text-[var(--text-secondary)]">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tools.slice(0, 4).map((tool) => (
            <span
              key={tool}
              className="rounded border border-[var(--border-primary)] bg-[var(--bg-primary)] px-2.5 py-1 text-xs text-[var(--logo-text)]"
            >
              {tool}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {hasCodeLink ? (
            <a
              href={project.code}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-pink-500/50 bg-pink-500/10 px-4 py-2 text-sm font-medium text-white transition hover:border-pink-400 hover:bg-pink-500/20 project-btn-pink"
            >
              <BsGithub size={17} />
              GitHub
            </a>
          ) : (
            <span
              className={disabledButtonClass}
              aria-disabled="true"
            >
              <BsGithub size={17} />
              GitHub
            </span>
          )}

          {hasDemoLink ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[#16f2b3]/50 bg-[#16f2b3]/10 px-4 py-2 text-sm font-medium text-white transition hover:border-[#16f2b3] hover:bg-[#16f2b3]/20 project-btn-teal"
            >
              <CgWebsite size={18} />
              Live Demo
            </a>
          ) : (
            <span
              className={disabledButtonClass}
              aria-disabled="true"
            >
              <CgWebsite size={18} />
              Live Demo
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;

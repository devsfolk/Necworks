type SectionHeadingProps = {title: string; eyebrow?: string; description?: string};

export function SectionHeading({title, eyebrow, description}: SectionHeadingProps) {
  return (
    <div className="section-heading">
      {eyebrow && <p className="section-heading__eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className="section-heading__description">{description}</p>}
    </div>
  );
}

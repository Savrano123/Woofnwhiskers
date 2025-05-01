import BackButton from './BackButton';

export default function PageHeader({ title, fallbackPath = '/' }) {
  return (
    <div className="mb-6">
      <BackButton fallbackPath={fallbackPath} className="mb-2" />
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
}

interface ServerPageProps {
  params: string;
}

const ServerPage: React.FC<ServerPageProps> = ({ params }) => {
  return <div>{JSON.stringify(params)}</div>;
};

export default ServerPage;

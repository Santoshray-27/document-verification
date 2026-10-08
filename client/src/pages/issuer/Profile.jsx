import React, { useState, useEffect } from 'react';
import { client } from '../../api/client';
import Skeleton from '../../components/Skeleton';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client(`/api/issuers/issuer-1`)
      .then(res => setProfile(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4"><Skeleton className="h-10" /><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800">Issuer Profile</h1>
      
      {profile && (
        <>
          <div className="bg-white p-6 rounded shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Identity Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium text-gray-800">{profile.issuer.name}</p>
              </div>
              <div>
                <p className="text-gray-500">ID</p>
                <p className="font-medium text-gray-800 font-mono">{profile.issuer.id}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Public Keys</h2>
            <p className="text-sm text-gray-500 mb-4">These keys are used by verifiers to authenticate your documents. Private keys are securely stored on the server and never exposed here.</p>
            {profile.publicKeys?.map((key, i) => (
              <div key={i} className="mb-4 last:mb-0 border p-4 rounded bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-700">Key ID: {key.id}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{key.status}</span>
                </div>
                <pre className="text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-x-auto border border-gray-200 font-mono">
                  {key.material}
                </pre>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;

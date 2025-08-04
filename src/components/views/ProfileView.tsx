import React from 'react';
import { Settings, Award, Star, TrendingUp, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ProfileView: React.FC = () => {
  const { user, signOut } = useAuth();

  const stats = [
    { label: 'Total Readings', value: '23', icon: Star },
    { label: 'Cards Collected', value: '45', icon: Award },
    { label: 'Trading Score', value: '892', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name || 'Guest User'}</h2>
            <p className="text-gray-400">{user?.email || 'No email'}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            <Settings className="w-4 h-4" />
            Edit Profile
          </button>
          {user && (
            <button 
              onClick={signOut}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-xl font-semibold text-yellow-400 mb-4">Recent Achievements</h3>
        <div className="space-y-3">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-medium">First Reading Complete</p>
              <p className="text-gray-400 text-sm">Completed your first tarot reading</p>
            </div>
          </div>
          
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center">
              <Star className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Card Collector</p>
              <p className="text-gray-400 text-sm">Collected your first 10 cards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
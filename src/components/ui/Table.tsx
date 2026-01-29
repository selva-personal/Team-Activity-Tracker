import React from 'react';
import clsx from 'clsx';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <div className="overflow-x-auto">
      <table className={clsx('min-w-full divide-y divide-gray-200 dark:divide-gray-700', className)}>
        {children}
      </table>
    </div>
  );
};

export const TableHead: React.FC<TableProps> = ({ children, className }) => {
  return (
    <thead className={clsx('bg-gray-50 dark:bg-gray-800', className)}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<TableProps> = ({ children, className }) => {
  return (
    <tbody className={clsx('bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700', className)}>
      {children}
    </tbody>
  );
};

export const TableRow: React.FC<TableProps & { onClick?: () => void }> = ({ children, className, onClick }) => {
  return (
    <tr
      className={clsx(
        'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export const TableHeader: React.FC<TableProps & { onClick?: () => void; sortable?: boolean }> = ({
  children,
  className,
  onClick,
  sortable,
}) => {
  return (
    <th
      className={clsx(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
        sortable && onClick && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
        className
      )}
      onClick={onClick}
    >
      {children}
      {sortable && <span className="ml-1">↕</span>}
    </th>
  );
};

export const TableCell: React.FC<TableProps> = ({ children, className }) => {
  return (
    <td className={clsx('px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100', className)}>
      {children}
    </td>
  );
};

import { useCallback, useEffect, useState } from 'react';
import AddEmployeeModal from '../features/employees/AddEmployeeModal';
import { getRoleLabel } from '../services/authService';
import {
  deleteNewEmployee,
  deleteUser,
  fetchAllUsers,
  fetchNewEmployees,
} from '../services/userService';
import styles from './UsersPage.module.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const TABLE_COLUMNS = [
  { key: 'full_name', label: 'ФИО' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Роль' },
  { key: 'phone', label: 'Телефон' },
  { key: 'position', label: 'Должность' },
  { key: 'department_name', label: 'Отдел' },
  { key: 'date_joined', label: 'Регистрация' },
];

function getCellValue(user, key) {
  switch (key) {
    case 'role':
      return getRoleLabel(user.role);
    case 'phone':
      return user.phone || '—';
    case 'position':
      return user.position || '—';
    case 'department_name':
      return user.department_name || '—';
    case 'date_joined':
      return formatDate(user.date_joined);
    default:
      return user[key] || '—';
  }
}

function getRoleClassName(role) {
  if (role === 'ADM') return `${styles.roleCell} ${styles.roleAdmin}`;
  return styles.roleCell;
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 19h4l9.8-9.8a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L5 15v4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.5 17.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 7l1 13h8l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M10 10v6M14 10v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function UsersPage({ mode }) {
  const isNewEmployees = mode === 'new';
  const isAdminUsers = mode === 'all';
  const canAddUser = isNewEmployees || isAdminUsers;
  const addModalVariant = isAdminUsers ? 'admin' : 'hr';
  const addButtonLabel = isAdminUsers ? 'Добавить пользователя' : 'Добавить сотрудника';
  const fetchUsers = isNewEmployees ? fetchNewEmployees : fetchAllUsers;
  const deleteFn = isNewEmployees ? deleteNewEmployee : deleteUser;

  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = useCallback(async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers(pageNumber);
      setUsers(data.results || []);
      setTotalCount(data.count || 0);
      setTotalPages(Math.max(1, Math.ceil((data.count || 0) / 20)));
    } catch (err) {
      setUsers([]);
      setError(
        err.response?.data?.detail
        || 'Не удалось загрузить список пользователей',
      );
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  useEffect(() => {
    loadUsers(page);
  }, [loadUsers, page]);

  const handleListChange = () => {
    loadUsers(page);
  };

  const handleDelete = async (user) => {
    const confirmed = window.confirm(`Удалить пользователя ${user.full_name}?`);
    if (!confirmed) return;

    setDeletingId(user.id);
    setError(null);

    try {
      await deleteFn(user.id);
      if (users.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        loadUsers(page);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Не удалось удалить пользователя');
    } finally {
      setDeletingId(null);
    }
  };

  const emptyMessage = isNewEmployees
    ? 'Новых сотрудников пока нет'
    : 'Пользователи не найдены';

  const columnCount = TABLE_COLUMNS.length + 1;

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <span className={styles.countBadge}>
          {loading ? 'Загрузка...' : `Всего: ${totalCount}`}
        </span>
        {canAddUser && (
          <button
            type="button"
            className={styles.addBtn}
            onClick={() => setShowAddModal(true)}
          >
            <span className={styles.addBtnIcon} aria-hidden="true">+</span>
            {addButtonLabel}
          </button>
        )}
      </div>

      {error && <p className={styles.errorHint}>{error}</p>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {TABLE_COLUMNS.map((column) => (
                <th key={column.key} scope="col">{column.label}</th>
              ))}
              <th className={styles.actionsHead} scope="col" aria-label="Действия" />
            </tr>
          </thead>
          <tbody>
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={columnCount} className={styles.emptyCell}>
                  {emptyMessage}
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id}>
                {TABLE_COLUMNS.map((column) => (
                  <td
                    key={column.key}
                    className={column.key === 'role' ? getRoleClassName(user.role) : undefined}
                  >
                    {getCellValue(user, column.key)}
                  </td>
                ))}
                <td className={styles.actionsCell}>
                  <div className={styles.actionsGroup}>
                    <button
                      type="button"
                      className={styles.actionBtn}
                      aria-label={`Редактировать ${user.full_name}`}
                      onClick={() => setEditingUser(user)}
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                      aria-label={`Удалить ${user.full_name}`}
                      disabled={deletingId === user.id}
                      onClick={() => handleDelete(user)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page <= 1 || loading}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Назад
          </button>
          <span className={styles.pageInfo}>
            Страница {page} из {totalPages}
          </span>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={page >= totalPages || loading}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Вперёд
          </button>
        </div>
      )}

      {showAddModal && (
        <AddEmployeeModal
          variant={addModalVariant}
          onClose={() => setShowAddModal(false)}
          onCreated={() => {
            setPage(1);
            loadUsers(1);
          }}
        />
      )}

      {editingUser && (
        <AddEmployeeModal
          variant={addModalVariant}
          initialUser={editingUser}
          onClose={() => setEditingUser(null)}
          onCreated={handleListChange}
        />
      )}
    </div>
  );
}

export default UsersPage;

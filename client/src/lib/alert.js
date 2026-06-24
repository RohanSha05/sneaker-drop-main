import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

export const alertSuccess = (message) =>
  Toast.fire({ icon: 'success', title: message });

export const alertError = (message) =>
  Toast.fire({ icon: 'error', title: message, timer: 5000 });

export const alertWarning = (message) =>
  Toast.fire({ icon: 'warning', title: message });

export const alertInfo = (message) =>
  Toast.fire({ icon: 'info', title: message });

export const alertConfirm = ({ title, text, confirmText = 'Yes', cancelText = 'Cancel' }) =>
  Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  });
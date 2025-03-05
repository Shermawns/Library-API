package com.cmcb.biblioteca.dtos;

public record ChangePassword(String currentPassword,
                             String newPassword,
                             String confirmPassword) {
}

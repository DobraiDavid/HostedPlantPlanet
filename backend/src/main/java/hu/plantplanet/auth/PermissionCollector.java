package hu.plantplanet.auth;

import hu.plantplanet.model.Users;
import hu.plantplanet.service.SpringContext;
import hu.plantplanet.service.UsersService;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class PermissionCollector implements UserDetails {

    @Getter
    private final Users user;

    private final UsersService userService = SpringContext.getBean(UsersService.class);

    public PermissionCollector(Users user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<String> permissions = userService.findPermissionsByUser(this.user.getId());
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        permissions.forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission)));
        return authorities;
    }

    @Override
    public String getUsername() {
        return this.user.getEmail();
    }

    public String getName() {
        return this.user.getName();
    }

    public String getEmail() {
        return this.user.getEmail();
    }

    public String getProfileImage() {
        return this.user.getProfileImage();
    }

    @Override
    public String getPassword() {
        return this.user.getPassword();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
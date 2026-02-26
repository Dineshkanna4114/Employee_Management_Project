package com.employeemanagement.repository;

import com.employeemanagement.entity.Employee;
import com.employeemanagement.entity.Employee.EmployeeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmail(String email);
    Optional<Employee> findByEmployeeId(String employeeId);
    boolean existsByEmail(String email);
    boolean existsByEmployeeId(String employeeId);

    Page<Employee> findByStatus(EmployeeStatus status, Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:search IS NULL OR LOWER(e.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.employeeId) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:departmentId IS NULL OR e.department.id = :departmentId) AND " +
           "(:status IS NULL OR e.status = :status)")
    Page<Employee> findWithFilters(
        @Param("search") String search,
        @Param("departmentId") Long departmentId,
        @Param("status") EmployeeStatus status,
        Pageable pageable
    );

    long countByStatus(EmployeeStatus status);

    @Query("SELECT e.department.name, COUNT(e) FROM Employee e WHERE e.department IS NOT NULL GROUP BY e.department.name")
    List<Object[]> countByDepartment();

    List<Employee> findByDepartmentId(Long departmentId);
}
